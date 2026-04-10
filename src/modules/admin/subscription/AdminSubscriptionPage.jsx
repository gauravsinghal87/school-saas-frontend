import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    getActiveSubscriptionsQuery,
    getSubscriptionPlanListQuery,
    renewSubscriptionMutation,
    verifySubscriptionMutation,
} from '../../../hooks/useQueryMutations'

// ─── helpers ────────────────────────────────────────────────────────────────

function formatINR(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}
function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
function daysLabel(days) {
    if (days >= 365) return `${Math.round(days / 365)}y`
    if (days >= 30) return `${Math.round(days / 30)} months`
    return `${days} days`
}

// ─── small components ────────────────────────────────────────────────────────

function CheckIcon() {
    return (
        <span className="flex items-center justify-center size-4 rounded-full bg-success/15 shrink-0">
            <svg className="size-2.5" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.3 2.5L8 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-success" />
            </svg>
        </span>
    )
}

function Spinner({ className = 'size-4' }) {
    return (
        <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z" />
        </svg>
    )
}

function ExpiryBar({ daysRemaining, totalDays }) {
    const pct = Math.max(0, Math.min(100, (daysRemaining / totalDays) * 100))
    const color = pct > 30 ? 'bg-success' : pct > 10 ? 'bg-warning' : 'bg-error'
    return (
        <div className="mt-3 max-w-sm">
            <div className="flex justify-between text-xs text-text-secondary mb-1.5">
                <span>{daysRemaining} days remaining</span>
                <span>{totalDays} day plan</span>
            </div>
            <div className="h-1.5 rounded-full bg-border overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    )
}

// ─── payment pending notice ──────────────────────────────────────────────────

function PaymentPendingBanner({ onResume, isLoading }) {
    return (
        <div className="rounded-2xl border border-warning/30 bg-warning/8 p-5 mb-7">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-warning">Payment pending</span>
                    <h2 className="text-xl font-bold text-text-heading">Complete your payment</h2>
                    <p className="text-sm text-text-secondary">An order was created but payment wasn't completed. Resume to finish the transaction.</p>
                </div>
                <button
                    onClick={onResume}
                    disabled={isLoading}
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-button-primary-hover active:scale-95 transition-all disabled:opacity-60"
                >
                    {isLoading ? <Spinner className="size-3.5" /> : null}
                    Resume payment
                </button>
            </div>
        </div>
    )
}

// ─── active plan banner ───────────────────────────────────────────────────────

function ActiveBanner({ subscription, onRenew, isRenewing }) {
    const { daysRemaining, isInGrace, startDate, endDate, gracePeriodEndDate, amount, plan } = subscription
    const totalDays = parseInt(plan?.duration_days ?? 30)
    const isSoon = !isInGrace && daysRemaining <= 7
    const urgent = isSoon || isInGrace
    const bannerBg = urgent ? 'bg-warning/8 border-warning/30' : 'bg-info/8 border-info/30'
    const eyebrow = isInGrace ? 'Grace period active' : isSoon ? 'Plan expiring soon' : 'Active plan'
    const eyebrowColor = urgent ? 'text-warning' : 'text-info'

    return (
        <div className={`rounded-2xl border p-5 mb-7 ${bannerBg}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-1">
                    <span className={`text-[11px] font-semibold uppercase tracking-widest ${eyebrowColor}`}>{eyebrow}</span>
                    <h2 className="text-xl font-bold text-text-heading">{plan?.name ?? 'Unknown plan'}</h2>
                    <p className="text-sm text-text-secondary">
                        {isInGrace
                            ? <>Plan expired <strong className="text-text-primary font-extrabold">{formatDate(endDate)}</strong> · Grace ends <strong className="text-text-primary font-extrabold">{formatDate(gracePeriodEndDate)}</strong></>
                            : <>Started <strong className="text-text-primary font-extrabold">{formatDate(startDate)}</strong> · Renews <strong className="text-text-primary font-medium">{formatDate(endDate)}</strong> · {formatINR(amount)} /  month</>
                        }
                    </p>
                    <ExpiryBar daysRemaining={isInGrace ? 0 : daysRemaining} totalDays={totalDays} />
                </div>
                <div className="flex flex-col items-end gap-3 shrink-0">
                    {isInGrace
                        ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-warning/15 text-warning border border-warning/20"><span className="size-1.5 rounded-full bg-warning animate-pulse" />Grace period</span>
                        : isSoon
                            ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-error/10 text-error border border-error/20"><span className="size-1.5 rounded-full bg-error animate-pulse" />Expiring soon</span>
                            : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20"><span className="size-1.5 rounded-full bg-success" />Active</span>
                    }
                    {urgent && (
                        <button
                            onClick={onRenew}
                            disabled={isRenewing}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-button-primary-hover active:scale-95 transition-all disabled:opacity-60"
                        >
                            {isRenewing ? <Spinner className="size-3.5" /> : null}
                            Renew now
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

function FreeBanner() {
    return (
        <div className="rounded-2xl border border-border bg-surface-card p-5 mb-7">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary">No active subscription</span>
                    <h2 className="text-xl font-bold text-text-heading mt-1">Free tier</h2>
                    <p className="text-sm text-text-secondary mt-1">You're on the free plan with limited access. Pick a plan below to unlock everything.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-page text-text-secondary border border-border">Free</span>
            </div>
        </div>
    )
}

function RenewUrgentBar({ subscription, onRenew, isRenewing }) {
    const { isInGrace, daysRemaining, gracePeriodEndDate } = subscription
    if (!isInGrace && daysRemaining > 7) return null
    const msg = isInGrace
        ? `You are in a grace period — services may be limited. Grace ends ${formatDate(gracePeriodEndDate)}.`
        : `Your plan expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}. Renew now to avoid interruption.`
    return (
        <div className="flex items-center justify-between gap-4 flex-wrap rounded-xl bg-error/8 border border-error/25 px-4 py-3 mb-7">
            <p className="text-sm text-error font-medium">{msg}</p>
            <button
                onClick={onRenew}
                disabled={isRenewing}
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-error text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
            >
                {isRenewing ? <Spinner className="size-3.5" /> : null}
                Renew now
            </button>
        </div>
    )
}

function PlanCard({ plan, isCurrentPlan, onSelect, isLoading }) {
    const isFree = parseInt(plan.price) === 0
    const isPremium = plan.name.toLowerCase().includes('premium')

    return (
        <div className={`relative rounded-2xl border bg-surface-card flex flex-col transition-all duration-150
            ${isCurrentPlan ? 'border-primary ring-1 ring-primary/20 shadow-sm' : isPremium ? 'border-secondary' : 'border-border hover:shadow-sm'}`}>
            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3 min-h-[22px]">
                    {isCurrentPlan && (
                        <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/15">Current plan</span>
                    )}
                    {!isCurrentPlan && isPremium && (
                        <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/20">Best value</span>
                    )}
                    {!isCurrentPlan && !isPremium && <span />}
                </div>
                <h3 className="text-base font-bold text-text-heading">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1 mb-4">
                    {isFree
                        ? <span className="text-3xl font-black text-text-primary">Free</span>
                        : <>
                            <span className="text-3xl font-black text-text-primary">{formatINR(parseInt(plan.price))}</span>
                            <span className="text-xs text-text-secondary">/ {daysLabel(parseInt(plan.duration_days))}</span>
                        </>
                    }
                </div>
                <ul className="flex flex-col gap-2 flex-1 mb-5">
                    <li className="flex items-center gap-2 text-sm text-text-secondary">
                        <CheckIcon />
                        <span className="capitalize">{plan.features}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-text-secondary">
                        <CheckIcon />
                        <span>{parseInt(plan.duration_days)} day validity</span>
                    </li>
                    {isPremium && (
                        <li className="flex items-center gap-2 text-sm text-text-secondary">
                            <CheckIcon />
                            <span>Priority support</span>
                        </li>
                    )}
                </ul>
                <button
                    onClick={() => !isCurrentPlan && !isFree && onSelect(plan)}
                    disabled={isCurrentPlan || isFree || isLoading}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2
                        ${isCurrentPlan
                            ? 'bg-primary/10 text-primary cursor-default'
                            : isFree
                                ? 'bg-surface-page text-text-secondary cursor-not-allowed border border-border'
                                : 'bg-primary text-white hover:bg-button-primary-hover disabled:opacity-60'
                        }`}
                >
                    {isLoading && !isCurrentPlan && !isFree ? <Spinner className="size-3.5" /> : null}
                    {isCurrentPlan ? 'Your current plan' : isFree ? 'Default' : `Get ${plan.name}`}
                </button>
            </div>
        </div>
    )
}

// ─── renewal history ─────────────────────────────────────────────────────────

function RenewalHistory({ history }) {
    if (!history?.length) return null
    return (
        <div className="mt-8">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">Renewal history</p>
            <div className="bg-surface-card rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Period</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Renewed on</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Txn ID</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {history.map((r) => (
                            <tr key={r._id} className="hover:bg-surface-page transition-colors">
                                <td className="px-4 py-3 text-text-secondary">
                                    {formatDate(r.startDate)} → {formatDate(r.endDate)}
                                </td>
                                <td className="px-4 py-3 text-text-primary font-medium">{formatDate(r.renewedAt)}</td>
                                <td className="px-4 py-3 font-mono text-xs text-text-secondary truncate max-w-[140px]">{r.transactionId}</td>
                                <td className="px-4 py-3 text-right font-semibold text-text-primary">{formatINR(r.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// ─── Razorpay helper ─────────────────────────────────────────────────────────

function openRazorpay({ order, schoolInfo, onSuccess, onDismiss }) {
    const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_API_KEY,
        amount: order.amount,
        currency: order.currency ?? 'INR',
        order_id: order.id,
        name: 'EduCore',
        description: 'School Subscription',
        prefill: {
            name: schoolInfo?.name ?? '',
            email: schoolInfo?.email ?? '',
            contact: schoolInfo?.phone ?? '',
        },
        theme: { color: '#2563EB' },
        handler: (response) => onSuccess(response),
        modal: { ondismiss: onDismiss },
    })
    rzp.open()
}

// ─── main page ───────────────────────────────────────────────────────────────

export const AdminSubscriptionPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const { data: planListData, isLoading: plansLoading } = getSubscriptionPlanListQuery()
    const { data: activeSubsData, isLoading: activeSubsLoading, refetch: refetchSub } = getActiveSubscriptionsQuery()
    const { mutateAsync: renewSubscription, isPending: isRenewing } = renewSubscriptionMutation()
    const { mutateAsync: verifySubscription, isPending: isVerifying } = verifySubscriptionMutation()

    const plans = planListData?.data ?? []
    const subscription = activeSubsData?.subscription ?? null
    const currentPlanId = subscription?.plan?._id ?? null
    const schoolInfo = subscription?.schoolId ?? null
    const isLoading = plansLoading || activeSubsLoading


    console.log('subscription', subscription)
    // pending state: order created but payment not done yet
    const isPendingPayment = subscription?.status === 'payment_pending' && !!subscription?.razorpayOrderId

    // track which plan card triggered a new purchase (non-current plans)
    const [purchasingPlanId, setPurchasingPlanId] = useState(null)

    // ── step=payment in URL → auto-open Razorpay ──────────────────────────────
    const paymentTriggered = useRef(false)

    useEffect(() => {
        if (searchParams.get('step') !== 'payment') return
        if (paymentTriggered.current) return
        if (!subscription) return

        // resume existing pending order OR wait — handled by PaymentPendingBanner
        if (isPendingPayment) {
            paymentTriggered.current = true
            launchRazorpay({
                orderId: subscription.razorpayOrderId,
                amount: subscription.amount * 100,
                currency: subscription.currency,
            })
        }
    }, [searchParams, subscription, isPendingPayment])

    // ── core: create order → push URL → Razorpay opens via useEffect ─────────
    const handleRenew = async (planId) => {
        try {
            const res = await renewSubscription({
                plan: planId,
                paymentMethod: 'razorpay',
                notes: 'renew subscription',
            })

            console.log('Renew response:', res)
            const order = res.razorpayOrder

            if (!order) throw new Error('No order returned')

            // push ?step=payment so refresh/back still lands on payment
            navigate(`?step=payment`, { replace: true })

            launchRazorpay({
                orderId: order.id,
                amount: order.amount,
                currency: order.currency ?? 'INR',
            })
        } catch (err) {
            console.error('Renew failed:', err)
        }
    }

    // ── open Razorpay modal ───────────────────────────────────────────────────
    const launchRazorpay = ({ orderId, amount, currency }) => {
        openRazorpay({
            order: { id: orderId, amount, currency },
            schoolInfo,
            onSuccess: async (response) => {
                try {
                    await verifySubscription({
                        // razorpay_order_id, razorpay_payment_id, razorpay_signature
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    })
                } catch (err) {
                    console.error('Verify failed:', err)
                } finally {
                    // clean URL regardless of verify result, then refresh data
                    navigate(window.location.pathname, { replace: true })
                    refetchSub()
                    setPurchasingPlanId(null)
                    paymentTriggered.current = false
                }
            },
            onDismiss: () => {
                // user closed modal — stay on payment_pending, clean URL
                navigate(window.location.pathname, { replace: true })
                setPurchasingPlanId(null)
                paymentTriggered.current = false
            },
        })
    }

    // ── plan card "Get plan" click ────────────────────────────────────────────
    const handleSelectPlan = async (plan) => {
        setPurchasingPlanId(plan._id)
        await handleRenew(plan._id)
        setPurchasingPlanId(null)
    }

    // ── loading state ─────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-64 bg-surface-page">
                <div className="flex items-center gap-3 text-text-secondary">
                    <Spinner className="size-5" />
                    <span className="text-sm font-medium">Loading subscription data…</span>
                </div>
            </div>
        )
    }

    // ── verifying overlay ─────────────────────────────────────────────────────
    if (isVerifying) {
        return (
            <div className="flex flex-col items-center justify-center min-h-64 gap-3 bg-surface-page">
                <Spinner className="size-6 text-primary" />
                <p className="text-sm font-medium text-text-secondary">Verifying payment…</p>
            </div>
        )
    }

    console.log('subscription?.razorpayOrderId', import.meta.env.VITE_RAZORPAY_API_KEY)

    return (
        <div className="min-h-screen bg-surface-page">
            <div className="max-w-4xl mx-auto px-4 py-8">

                <div className="mb-7">
                    <h1 className="text-2xl font-bold text-text-heading">Your Subscription Plan</h1>
                    <p className="text-sm text-text-secondary mt-1">Manage your school's plan and billing</p>
                </div>

                {/* payment pending — order created, payment not done */}
                {isPendingPayment && (
                    <PaymentPendingBanner
                        onResume={() => launchRazorpay({
                            key: import.meta.env.VITE_RAZORPAY_API_KEY,
                            orderId: subscription?.razorpayOrderId,
                            amount: subscription.amount * 100,
                            currency: subscription.currency || 'INR',
                        })}
                        isLoading={isRenewing}
                    />
                )}

                {/* active plan banner */}
                {subscription && !isPendingPayment
                    ? <ActiveBanner
                        subscription={subscription}
                        onRenew={() => handleRenew(currentPlanId)}
                        isRenewing={isRenewing}
                    />
                    : !subscription && <FreeBanner />
                }

                {/* urgent bottom renew bar */}
                {subscription && !isPendingPayment && (
                    <RenewUrgentBar
                        subscription={subscription}
                        onRenew={() => handleRenew(currentPlanId)}
                        isRenewing={isRenewing}
                    />
                )}

                {/* stats */}
                {subscription && (
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        {[
                            {
                                label: 'Status',
                                value: isPendingPayment ? 'Pending' : subscription.status === 'active' ? 'Active' : subscription.status,
                                color: isPendingPayment ? 'text-warning' : 'text-success',
                            },
                            {
                                label: 'Days left',
                                value: subscription.daysRemaining,
                                color: subscription.daysRemaining <= 7 ? 'text-error' : 'text-text-primary',
                            },
                            {
                                label: 'Grace days',
                                value: subscription.gracePeriodDays,
                                color: 'text-text-primary',
                            },
                        ].map(s => (
                            <div key={s.label} className="bg-surface-card rounded-xl p-4 border border-border">
                                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                                <p className="text-xs text-text-secondary font-medium uppercase tracking-wider mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* plan list */}
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">Available plans</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plans.map(plan => (
                        <PlanCard
                            key={plan._id}
                            plan={plan}
                            isCurrentPlan={plan._id === currentPlanId}
                            onSelect={handleSelectPlan}
                            isLoading={purchasingPlanId === plan._id}
                        />
                    ))}
                </div>

                {/* renewal history table */}
                <RenewalHistory history={subscription?.renewalHistory} />

            </div>
        </div>
    )
}
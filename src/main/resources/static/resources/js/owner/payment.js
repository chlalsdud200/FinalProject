document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.querySelector('meta[name="ctx-path"]')?.content || "";
    const csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;

    const payButton = document.querySelector(".btn-toss-pay");

    if (!payButton) {
        return;
    }

    payButton.addEventListener("click", async function () {
        const claimNo = this.dataset.claimNo || this.dataset.tcsNo;
        const recordTy = this.dataset.recordTy || "FREIGHT";

        if (!claimNo) {
            alert("정산번호를 확인할 수 없습니다.");
            return;
        }

        const confirmMessage = recordTy === "BROKER_CHARGE"
            ? "관세 청구 금액을 결제하시겠습니까?"
            : "운임을 결제하시겠습니까?";

        if (!confirm(confirmMessage)) {
            return;
        }

        const headers = {
            "Content-Type": "application/json"
        };

        if (csrfToken && csrfHeader) {
            headers[csrfHeader] = csrfToken;
        }

        try {
            const readyResponse = await fetch(`${ctx}/owner/payment/ready.do`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    claimNo: claimNo,
                    recordTy: recordTy
                })
            });

            if (!readyResponse.ok) {
                alert("결제 준비 중 오류가 발생했습니다.");
                return;
            }

            const ready = await readyResponse.json();

            if (ready.result && ready.result !== "OK") {
                alert(ready.message || "결제 준비 중 오류가 발생했습니다.");
                return;
            }

            const tossPayments = TossPayments(ready.clientKey);

            const widgets = tossPayments.widgets({
                customerKey: ready.customerKey
            });

            await widgets.setAmount({
                value: ready.amount,
                currency: "KRW"
            });

            const paymentWindow = await widgets.renderPaymentWindow({
                variantKey: {
                    paymentMethod: "DEFAULT",
                    agreement: "AGREEMENT"
                }
            });

            paymentWindow.on("paymentRequest", async function () {
                try {
                    await widgets.requestPayment({
                        orderId: ready.orderId,
                        orderName: ready.orderName,
                        successUrl: window.location.origin + ctx + "/owner/payment/success.do",
                        failUrl: window.location.origin + ctx + "/owner/payment/fail.do"
                    });
                } catch (error) {
                    console.error("결제 실패/취소:", error);

                    const code = error.code || "USER_CANCEL";
                    const message = error.message || "사용자가 결제를 취소했습니다.";

                    if (
                        code === "USER_CANCEL" ||
                        code === "PAY_PROCESS_CANCELED" ||
                        code === "PAYMENT_CANCELED"
                    ) {
                        location.href =
                            `${ctx}/owner/payment/fail.do`
                            + `?code=${encodeURIComponent(code)}`
                            + `&message=${encodeURIComponent(message)}`
                            + `&orderId=${encodeURIComponent(ready.orderId)}`;
                        return;
                    }

                    alert(message);
                }
            });

        } catch (error) {
            console.error("결제 요청 중 오류:", error);
            alert("결제 요청 중 오류가 발생했습니다.");
        }
    });
});
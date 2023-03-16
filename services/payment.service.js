class PaymentService {
  constructor() {}

  sendRequest(from, to) {
    const payReq = ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: account,
          to: account,
        },
      ],
    });
  }
}

const paymentService = new PaymentService();
module.exports = paymentService;

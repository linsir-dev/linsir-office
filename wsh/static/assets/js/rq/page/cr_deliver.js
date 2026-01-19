define(['jquery'], function ($) {
    $(function () {
        $.ajax({
            type: "GET",
            url: "/apis/preq/order-list2.json",
            data: {},
            success: function (data) {
                var html = "";
                var d;
                for (item in data.list) {
                    d = data.list[item];
                    html += '<tr>'
                    html += '<td>' + d.subOrderNo + '</td>'
                    html += '<td>' + d.placeOrderTime + '</td>'
                    html += '<td>' + d.orderMoney + '</td>'
                    html += '<td>' + d.payWay + '</td>'
                    html += '<td>' + d.contractState + '</td>'
                    html += '<td>'
                    if (d.contractState === '签订完成') {
                        html += '<a href = "confirm-receipt-upload.html" >提取</a></td></tr>'
                    } else {
                        html += '<a href = "javascript:;" >提取</a></td></tr>'
                    }

                }

                console.log(html)
                $('.table tbody').append(html)
            },
            error: function (a, b, c) {

                console.log([a, b, c].join('|'));
            }
        });
    })
})

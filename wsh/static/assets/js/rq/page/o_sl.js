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
                    html += '<td align="center">'
                    html += '<span>' + d.subOrderNo + '</span></td>'
                    html += '<td align="center">' + d.supplier + '</td>'
                    html += '<td align="center">' + d.placeOrderTime + '</td>'
                    html += '<td align="center">' + d.orderMoney + '</td>'
                    html += '<td align="center">' + d.payWay + '</td>'
                    html += '<td align="center">' + d.orderStatus + '</td>'
                    html += '<td align="center">'
                    html += '<a href="#">查看</a>'
                    html += '<a href="#">打印</a>'
                    if (d.operate === true) {
                        html += '<a href="#">催促确认</a></td>'
                    }

                    html += '<td>' + d.contractState + '</td></tr>'
                }
                console.log(html)
                $('.table tbody').append(html)
            }
        });
    })
})

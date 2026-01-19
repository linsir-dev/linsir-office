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
                    console.log(d.clQuotation)
                    html += '<tr>';
                    html += '<td align="center">' + d.drugSno + '</td>';
                    html += '<td align="center">' + d.baseName + '</td>';
                    html += '<td align="center">' + d.proManufactor + '</td>';
                    html += '<td align="center">' + d.drugSpecific + '</td>';
                    html += '<td align="center">' + d.prickle + '</td>';
                    html += '<td align="center">' + d.quantity + '</td>';
                    html += '<td align="center">' + d.clQuotation + '</td></tr>';
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

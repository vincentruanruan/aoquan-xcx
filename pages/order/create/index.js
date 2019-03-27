var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, e = "function" == typeof Symbol && "symbol" == t(Symbol.iterator) ? function(e) {
    return void 0 === e ? "undefined" : t(e);
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : void 0 === e ? "undefined" : t(e);
}, a = "function" == typeof Symbol && "symbol" == e(Symbol.iterator) ? function(t) {
    return void 0 === t ? "undefined" : e(t);
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : void 0 === t ? "undefined" : e(t);
}, i = getApp(), s = i.requirejs("core"), o = i.requirejs("foxui"), r = i.requirejs("biz/diyform"), d = i.requirejs("jquery"), n = i.requirejs("biz/selectdate");

Page({
    data: {
        icons: i.requirejs("icons"),
        list: {},
        goodslist: {},
        data: {
            dispatchtype: 0,
            remark: ""
        },
        areaDetail: {
            detail: {
                realname: "",
                mobile: "",
                areas: "",
                street: "",
                address: ""
            }
        },
        merchid: 0,
        showPicker: !1,
        pvalOld: [ 0, 0, 0 ],
        pval: [ 0, 0, 0 ],
        areas: [],
        street: [],
        streetIndex: 0,
        noArea: !1,
        showaddressview: !1,
        city_express_state: !1,
        currentDate: "",
        dayList: "",
        currentDayList: "",
        currentObj: "",
        currentDay: "",
        cycelbuy_showdate: "",
        receipttime: "",
        scope: "",
        bargainid: ""
    },
    onLoad: function(t) {
        var e = this, a = [];
        if (t.goods) {
            var o = JSON.parse(t.goods);
            t.goods = o, this.setData({
                ispackage: !0
            });
        }
        e.setData({
            options: t
        }), e.setData({
            bargainid: t.bargainid
        }), i.url(t), console.log(e.data.options), s.get("order/create", e.data.options, function(t) {
            if (console.log(t), 0 == t.error) {
                console.log(t), a = e.getGoodsList(t.goods);
                var o = (e.data.originalprice - t.goodsprice).toFixed(2);
                e.setData({
                    list: t,
                    goods: t,
                    show: !0,
                    address: !0,
                    goodslist: a,
                    merchid: t.merchid,
                    comboprice: o,
                    diyform: {
                        f_data: t.f_data,
                        fields: t.fields
                    },
                    city_express_state: t.city_express_state,
                    cycelbuy_showdate: t.selectDate,
                    receipttime: t.receipttime,
                    iscycel: t.iscycel,
                    scope: t.scope,
                    fromquick: t.fromquick,
                    hasinvoice: t.hasinvoice
                }), i.setCache("goodsInfo", {
                    goodslist: a,
                    merchs: t.merchs
                }, 1800);
            } else s.toast(t.message, "loading"), setTimeout(function() {
                wx.navigateBack();
            }, 1e3);
            if ("" != t.fullbackgoods) {
                if (void 0 == t.fullbackgoods) return;
                var r = t.fullbackgoods.fullbackratio, d = t.fullbackgoods.maxallfullbackallratio, r = Math.round(r), d = Math.round(d);
                e.setData({
                    fullbackratio: r,
                    maxallfullbackallratio: d
                });
            }
            1 == t.iscycel && e.show_cycelbuydate();
        }), this.getQuickAddressDetail(), i.setCache("coupon", ""), setTimeout(function() {
            e.setData({
                areas: i.getCache("cacheset").areas
            });
        }, 3e3);
    },
    show_cycelbuydate: function() {
        var t = this, e = n.getCurrentDayString(this, t.data.cycelbuy_showdate), a = [ "周日", "周一", "周二", "周三", "周四", "周五", "周六" ];
        t.setData({
            currentObj: e,
            currentDate: e.getFullYear() + "." + (e.getMonth() + 1) + "." + e.getDate() + " " + a[e.getDay()],
            currentYear: e.getFullYear(),
            currentMonth: e.getMonth() + 1,
            currentDay: e.getDate(),
            initDate: Date.parse(e.getFullYear() + "/" + (e.getMonth() + 1) + "/" + e.getDate()),
            checkedDate: Date.parse(e.getFullYear() + "/" + (e.getMonth() + 1) + "/" + e.getDate()),
            maxday: t.data.scope
        });
    },
    onShow: function() {
        var t = this, e = i.getCache("orderAddress"), o = i.getCache("orderShop");
        i.getCache("isIpx") ? t.setData({
            isIpx: !0,
            iphonexnavbar: "fui-iphonex-navbar",
            paddingb: "padding-b"
        }) : t.setData({
            isIpx: !1,
            iphonexnavbar: "",
            paddingb: ""
        }), e && (this.setData({
            "list.address": e
        }), t.caculate(t.data.list)), o && this.setData({
            "list.carrierInfo": o,
            "list.storeInfo": o
        });
        var r = i.getCache("coupon");
        "object" == (void 0 === r ? "undefined" : a(r)) && 0 != r.id ? (this.setData({
            "data.couponid": r.id,
            "data.couponname": r.name
        }), s.post("order/create/getcouponprice", {
            couponid: r.id,
            goods: this.data.goodslist,
            goodsprice: this.data.list.goodsprice,
            discountprice: this.data.list.discountprice,
            isdiscountprice: this.data.list.isdiscountprice
        }, function(e) {
            0 == e.error ? (delete e.$goodsarr, t.setData({
                coupon: e
            }), t.caculate(t.data.list)) : s.alert(e.message);
        }, !0)) : (this.setData({
            "data.couponid": 0,
            "data.couponname": null,
            coupon: null
        }), d.isEmptyObject(t.data.list) || t.caculate(t.data.list));
    },
    getGoodsList: function(t) {
        var e = [];
        d.each(t, function(t, a) {
            d.each(a.goods, function(t, a) {
                e.push(a);
            });
        });
        for (var a = 0, i = 0; i < e.length; i++) a += e[i].price;
        return console.log(a), this.setData({
            originalprice: a
        }), e;
    },
    toggle: function(t) {
        var e = s.pdata(t), a = e.id, i = {};
        i[e.type] = 0 == a || void 0 === a ? 1 : 0, this.setData(i);
    },
    phone: function(t) {
        s.phone(t);
    },
    dispatchtype: function(t) {
        var e = s.data(t).type;
        this.setData({
            "data.dispatchtype": e
        }), this.caculate(this.data.list);
    },
    number: function(t) {
        var e = this, a = s.pdata(t), i = o.number(this, t), r = a.id, n = e.data.list, c = 0, l = 0;
        d.each(n.goods, function(t, e) {
            d.each(e.goods, function(e, a) {
                a.id == r && (n.goods[t].goods[e].total = i), c += parseInt(n.goods[t].goods[e].total), 
                l += parseFloat(c * n.goods[t].goods[e].price);
            });
        }), n.total = c, n.goodsprice = d.toFixed(l, 2), e.setData({
            list: n,
            goodslist: e.getGoodsList(n.goods)
        }), this.caculate(n);
    },
    caculate: function(t) {
        var e = this;
        s.post("order/create/caculate", {
            goods: this.data.goodslist,
            dflag: this.data.data.dispatchtype,
            addressid: this.data.list.address ? this.data.list.address.id : 0,
            packageid: this.data.list.packageid,
            bargain_id: this.data.bargainid
        }, function(a) {
            t.dispatch_price = a.price, t.enoughdeduct = a.deductenough_money, t.enoughmoney = a.deductenough_enough, 
            t.taskdiscountprice = a.taskdiscountprice, t.discountprice = a.discountprice, t.isdiscountprice = a.isdiscountprice, 
            t.seckill_price = a.seckill_price, t.deductcredit2 = a.deductcredit2, e.data.data.deduct && (a.realprice -= a.deductcredit), 
            e.data.data.deduct2 && (a.realprice -= a.deductcredit2), e.data.coupon && void 0 !== e.data.coupon.deductprice && (a.realprice -= e.data.coupon.deductprice), 
            t.realprice = d.toFixed(a.realprice, 2), e.setData({
                list: t,
                city_express_state: a.city_express_state
            });
        }, !0);
    },
    submit: function() {
        var t = this.data, e = this, a = this.data.diyform, i = t.giftid;
        if (0 == this.data.goods.giftid && 1 == this.data.goods.gifts.length && (i = this.data.goods.gifts[0].id), 
        console.log(t.fromquick), !t.submit && r.verify(this, a)) {
            t.list.carrierInfo = t.list.carrierInfo || {};
            var o = {
                id: t.options.id ? t.options.id : 0,
                goods: t.goodslist,
                gdid: t.options.gdid,
                dispatchtype: t.data.dispatchtype,
                fromcart: t.list.fromcart,
                carrierid: 1 == t.data.dispatchtype && t.list.carrierInfo ? t.list.carrierInfo.id : 0,
                addressid: t.list.address ? t.list.address.id : 0,
                carriers: 1 == t.data.dispatchtype || t.list.isvirtual || t.list.isverify ? {
                    carrier_realname: t.list.member.realname,
                    carrier_mobile: t.list.member.mobile,
                    realname: t.list.carrierInfo.realname,
                    mobile: t.list.carrierInfo.mobile,
                    storename: t.list.carrierInfo.storename,
                    address: t.list.carrierInfo.address
                } : "",
                remark: t.data.remark,
                deduct: t.data.deduct,
                deduct2: t.data.deduct2,
                couponid: t.data.couponid,
                invoicename: t.list.invoicename,
                submit: !0,
                packageid: t.list.packageid,
                giftid: i,
                diydata: t.diyform.f_data,
                receipttime: t.receipttime,
                bargain_id: e.data.options.bargainid,
                fromquick: t.fromquick
            };
            if (t.list.storeInfo && (o.carrierid = t.list.storeInfo.id), 1 == t.data.dispatchtype || t.list.isvirtual || t.list.isverify) {
                if ("" == d.trim(t.list.member.realname)) return void s.alert("请填写联系人!");
                if ("" == d.trim(t.list.member.mobile)) return void s.alert("请填写联系方式!");
                if (t.list.isforceverifystore && !t.list.storeInfo) return void s.alert("请选择门店!");
                o.addressid = 0;
            } else if (!o.addressid && !t.list.isonlyverifygoods) return void s.alert("地址没有选择!");
            e.setData({
                submit: !0
            }), s.post("order/create/submit", o, function(t) {
                e.setData({
                    submit: !1
                }), 0 == t.error ? wx.navigateTo({
                    url: "/pages/order/pay/index?id=" + t.orderid
                }) : s.alert(t.message);
            }, !0);
        }
    },
    dataChange: function(t) {
        var e = this.data.data, a = this.data.list;
        switch (t.target.id) {
          case "remark":
            e.remark = t.detail.value;
            break;

          case "deduct":
            e.deduct = t.detail.value, i = parseFloat(a.realprice), i += e.deduct ? -parseFloat(a.deductmoney) : parseFloat(a.deductmoney), 
            a.realprice = i;
            break;

          case "deduct2":
            e.deduct2 = t.detail.value;
            var i = parseFloat(a.realprice);
            i += e.deduct2 ? -parseFloat(a.deductcredit2) : parseFloat(a.deductcredit2), a.realprice = i;
        }
        a.realprice = d.toFixed(a.realprice, 2), this.setData({
            data: e,
            list: a
        });
    },
    listChange: function(t) {
        var e = this.data.list;
        switch (t.target.id) {
          case "invoicename":
            e.invoicename = t.detail.value;
            break;

          case "realname":
            e.member.realname = t.detail.value;
            break;

          case "mobile":
            e.member.mobile = t.detail.value;
        }
        this.setData({
            list: e
        });
    },
    url: function(t) {
        var e = s.pdata(t).url;
        wx.redirectTo({
            url: e
        });
    },
    onChange: function(t) {
        return r.onChange(this, t);
    },
    DiyFormHandler: function(t) {
        return r.DiyFormHandler(this, t);
    },
    selectArea: function(t) {
        return r.selectArea(this, t);
    },
    bindChange: function(t) {
        return r.bindChange(this, t);
    },
    onCancel: function(t) {
        return r.onCancel(this, t);
    },
    onConfirm: function(t) {
        r.onConfirm(this, t);
        var e = this.data.pval, a = this.data.areas, i = this.data.areaDetail.detail;
        i.province = a[e[0]].name, i.city = a[e[0]].city[e[1]].name, i.datavalue = a[e[0]].code + " " + a[e[0]].city[e[1]].code, 
        a[e[0]].city[e[1]].area && a[e[0]].city[e[1]].area.length > 0 ? (i.area = a[e[0]].city[e[1]].area[e[2]].name, 
        i.datavalue += " " + a[e[0]].city[e[1]].area[e[2]].code, this.getStreet(a, e)) : i.area = "", 
        i.street = "", this.setData({
            "areaDetail.detail": i,
            streetIndex: 0,
            showPicker: !1
        });
    },
    getIndex: function(t, e) {
        return r.getIndex(t, e);
    },
    showaddressview: function(t) {
        var e = "";
        e = "open" == t.target.dataset.type, this.setData({
            showaddressview: e
        });
    },
    onChange2: function(t) {
        var e = this, a = e.data.areaDetail.detail, i = t.currentTarget.dataset.type, s = d.trim(t.detail.value);
        "street" == i && (a.streetdatavalue = e.data.street[s].code, s = e.data.street[s].name), 
        a[i] = s, e.setData({
            "areaDetail.detail": a
        });
    },
    getStreet: function(t, e) {
        if (t && e) {
            var a = this;
            if (a.data.areaDetail.detail.province && a.data.areaDetail.detail.city && this.data.openstreet) {
                var i = t[e[0]].city[e[1]].code, o = t[e[0]].city[e[1]].area[e[2]].code;
                s.get("getstreet", {
                    city: i,
                    area: o
                }, function(t) {
                    var e = t.street, i = {
                        street: e
                    };
                    if (e && a.data.areaDetail.detail.streetdatavalue) for (var s in e) if (e[s].code == a.data.areaDetail.detail.streetdatavalue) {
                        i.streetIndex = s, a.setData({
                            "areaDetail.detail.street": e[s].name
                        });
                        break;
                    }
                    a.setData(i);
                });
            }
        }
    },
    getQuickAddressDetail: function() {
        var t = this, e = t.data.id;
        s.get("member/address/get_detail", {
            id: e
        }, function(e) {
            var a = {
                openstreet: e.openstreet,
                show: !0
            };
            if (!d.isEmptyObject(e.detail)) {
                var i = e.detail.province + " " + e.detail.city + " " + e.detail.area, s = t.getIndex(i, t.data.areas);
                a.pval = s, a.pvalOld = s, a.areaDetail.detail = e.detail;
            }
            t.setData(a), e.openstreet && s && t.getStreet(t.data.areas, s);
        });
    },
    submitaddress: function() {
        var t = this, e = t.data.areaDetail.detail;
        t.data.posting || ("" != e.realname && e.realname ? "" != e.mobile && e.mobile ? "" != e.city && e.city ? !(t.data.street.length > 0) || "" != e.street && e.street ? "" != e.address && e.address ? e.datavalue ? (e.id = 0, 
        t.setData({
            posting: !0
        }), s.post("member/address/submit", e, function(a) {
            if (0 != a.error) return t.setData({
                posting: !1
            }), void o.toast(t, a.message);
            e.id = a.addressid, t.setData({
                showaddressview: !1,
                "list.address": e
            }), s.toast("保存成功");
        })) : o.toast(t, "地址数据出错，请重新选择") : o.toast(t, "请填写详细地址") : o.toast(t, "请选择所在街道") : o.toast(t, "请选择所在地区") : o.toast(t, "请填写联系电话") : o.toast(t, "请填写收件人"));
    },
    giftPicker: function() {
        this.setData({
            active: "active",
            gift: !0
        });
    },
    emptyActive: function() {
        this.setData({
            active: "",
            slider: "out",
            tempname: "",
            showcoupon: !1,
            gift: !1
        });
    },
    radioChange: function(t) {
        this.setData({
            giftid: t.currentTarget.dataset.giftgoodsid,
            gift_title: t.currentTarget.dataset.title
        });
    },
    sendclick: function() {
        wx.navigateTo({
            url: "/pages/map/index"
        });
    },
    clearform: function() {
        var t = this.data.diyform;
        t.f_data = "", this.setData({
            diyform: t
        });
    },
    syclecancle: function() {
        this.setData({
            cycledate: !1
        });
    },
    sycleconfirm: function() {
        this.setData({
            cycledate: !1
        });
    },
    editdate: function(t) {
        n.setSchedule(this), this.setData({
            cycledate: !0,
            create: !0
        });
    },
    doDay: function(t) {
        n.doDay(t, this);
    },
    selectDay: function(t) {
        n.selectDay(t, this), n.setSchedule(this);
    },
    showinvoicepicker: function() {
        var t = this.data.list;
        0 == t.invoice_type && (t.invoice_info.entity = !0), 1 == t.invoice_type && (t.invoice_info.entity = !1), 
        this.setData({
            invoicepicker: !0,
            list: t
        });
    },
    noinvoicepicker: function() {
        this.setData({
            invoicepicker: !1
        });
    },
    clearinvoice: function() {
        var t = this.data.list;
        t.invoicename = "", this.setData({
            invoicepicker: !1,
            list: t
        });
    },
    chaninvoice: function(t) {
        var e = this.data.list;
        "0" == t.currentTarget.dataset.type ? e.invoice_info.entity = !1 : e.invoice_info.entity = !0, 
        this.setData({
            list: e
        });
    },
    changeType: function(t) {
        var e = this.data.list;
        "0" == t.currentTarget.dataset.type ? e.invoice_info.company = !1 : e.invoice_info.company = !0, 
        this.setData({
            list: e
        });
    },
    invoicetitle: function(t) {
        var e = this.data.list;
        e.invoice_info.title = t.detail.value.replace(/\s+/g, ""), this.setData({
            list: e
        });
    },
    invoicenumber: function(t) {
        var e = this.data.list;
        e.invoice_info.number = t.detail.value.replace(/\s+/g, ""), this.setData({
            list: e
        });
    },
    confirminvoice: function() {
        var t = this.data.list;
        t.invoice_info.company || this.setData({
            invoicenumber: ""
        });
        var e = t.invoice_info.entity ? "[纸质] " : "[电子] ", a = t.invoice_info.title + " ", i = t.invoice_info.company ? "（单位: " + t.invoice_info.number + "）" : "（个人）";
        t.invoicename = e + a + i, t.invoice_info.title ? t.invoice_info.company && !t.invoice_info.number ? o.toast(this, "请填写税号") : this.setData({
            list: t,
            invoicepicker: !1
        }) : o.toast(this, "请填写发票抬头");
    }
});
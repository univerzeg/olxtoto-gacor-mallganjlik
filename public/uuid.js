(function () {
  "use strict";
  var NS = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";

  function sha1(bytes) {
    var ml = bytes.length * 8;
    var m = bytes.slice(0);
    m.push(128);
    while (m.length % 64 !== 56) m.push(0);
    for (var i = 0; i < 8; i++) m.push(Math.floor(ml / Math.pow(256, 7 - i)) & 255);
    var h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
    var w = new Array(80);
    for (var j = 0; j < m.length; j += 64) {
      for (var t = 0; t < 16; t++) {
        w[t] = (m[j + 4 * t] << 24) | (m[j + 4 * t + 1] << 16) | (m[j + 4 * t + 2] << 8) | m[j + 4 * t + 3];
      }
      for (t = 16; t < 80; t++) {
        var n = w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16];
        w[t] = (n << 1) | (n >>> 31);
      }
      var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f, k, tmp;
      for (t = 0; t < 80; t++) {
        if (t < 20) { f = (b & c) | ((~b) & d); k = 1518500249; }
        else if (t < 40) { f = b ^ c ^ d; k = 1859775393; }
        else if (t < 60) { f = (b & c) | (b & d) | (c & d); k = 2400959708; }
        else { f = b ^ c ^ d; k = 3395469782; }
        tmp = ((a << 5) | (a >>> 27)) + f + e + k + w[t] | 0;
        e = d; d = c; c = (b << 30) | (b >>> 2); b = a; a = tmp;
      }
      h[0] = h[0] + a | 0;
      h[1] = h[1] + b | 0;
      h[2] = h[2] + c | 0;
      h[3] = h[3] + d | 0;
      h[4] = h[4] + e | 0;
    }
    var out = [];
    for (var i = 0; i < 5; i++) for (var s = 24; s >= 0; s -= 8) out.push((h[i] >>> s) & 255);
    return out;
  }

  function uuid5(ns, name) {
    var hex = ns.replace(/-/g, "");
    var b = [];
    for (var i = 0; i < 16; i++) b.push(parseInt(hex.substr(i * 2, 2), 16));
    for (i = 0; i < name.length; i++) b.push(name.charCodeAt(i) & 255);
    var h = sha1(b).slice(0, 16);
    h[6] = (h[6] & 15) | 80;
    h[8] = (h[8] & 63) | 128;
    var x = "";
    for (i = 0; i < 16; i++) x += ("0" + h[i].toString(16)).slice(-2);
    return x.substr(0, 8) + "-" + x.substr(8, 4) + "-" + x.substr(12, 4) + "-" + x.substr(16, 4) + "-" + x.substr(20);
  }

  var r = "";
  try {
    var bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    for (var i = 0; i < 16; i++) r += ("0" + bytes[i].toString(16)).slice(-2);
  } catch (e) {
    for (var j = 0; j < 16; j++) r += ("0" + (Math.random() * 256 | 0).toString(16)).slice(-2);
  }

  var base = "https://uuid-random-string.indof1.site";
  var links = { brand: base, daftar: base + "/registerasi", login: base + "/home?login" };
  for (var id in links) {
    var el = document.getElementById(id);
    if (el) el.setAttribute("href", links[id]);
  }
})();

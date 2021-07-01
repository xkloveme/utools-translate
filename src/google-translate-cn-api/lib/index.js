'use strict';


import * as languages from './languages'

function request (url, data, method = 'POST') {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  for (const key in data) {
    urlencoded.append(key, data[key]);
  }
  let options = {
    method: method,
    //允许跨域携带资源凭证 same-origin 同源可以 omit都拒绝
    credentials: 'include', //不管同源不同元都可以携带资源凭证
    redirect: 'follow',
    //设置请求头
    headers: myHeaders,
    body: urlencoded
  };
  return fetch(url, options).then(response => {
    if (!/^(2|3)\d$/.test(response.status)) {
      switch (response.status) {
        case 401: //当前请求需要用户验证（一般是未登录）
          break;
        case 403: //服务器已经理解请求，但是拒绝执行他（一般是TOKEN过期）
          localStorage.removeItem('token');
          //跳转的登录页面
          break;
        case 404: //请求失败，请求所希望的到的资源未被在服务器上发现
          break;
      }
    }
    return response.json()
  }).catch(error => {
    if (!window.navigator.onLine) {
      //网络断开了，可以让其跳转到断网页面
      return;
    }
    return Promise.reject(error);
  })
}

export const translate = async (text, opts) => {
  opts = opts || {};

  [opts.from, opts.to].forEach(function (lang) {
    if (lang && !languages.isSupported(lang)) {
      throw new Error('The language \'' + lang + '\' is not supported');
    }
  });
  opts.from = opts.from || 'auto';
  opts.to = opts.to || 'en';
  opts.from = languages.getCode(opts.from);
  opts.to = languages.getCode(opts.to);
  opts.domain = opts.domain || 'cn';

  let url = `https://translate.google.${opts.domain}/translate_a/single`;
  const data = {
    client: 'gtx',
    sl: opts.from,
    tl: opts.to,
    hl: opts.to,
    dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
    otf: 1,
    ssel: 0,
    tsel: 0,
    kc: 7,
  };
  let convertObj = (data) => {
    var _result = [];
    for (var key in data) {
      var value = data[key];
      if (value.constructor == Array) {
        value.forEach(function (_value) {
          _result.push(key + "=" + _value);
        });
      } else {
        _result.push(key + '=' + value);
      }
    }
    return _result.join('&');
  }
  url += '?' + convertObj(data);
  const raw =  await request(url, { q: text })
  const body = handleBody(raw, opts);
  return body;

};


function handleBody (raw, opts) {
  const result = {
    text: '',
    from: {
      language: {
        didYouMean: false,
        iso: ''
      },
      text: {
        autoCorrected: false,
        value: '',
        didYouMean: false
      }
    },
    raw: ''
  };

  if (opts.raw) result.raw = raw;

  const body = raw;
  body[0].forEach(function (obj) {
    if (obj[0] !== null) result.text += obj[0];
  });

  if (body[2] === body[8][0][0]) {
    result.from.language.iso = body[2];
  } else {
    result.from.language.didYouMean = true;
    result.from.language.iso = body[8][0][0];
  }

  if (body[5] && body[5][0] && body[5][0][0]) {
    let str = body[5][0][0];

    str = str.replace(/<b><i>/g, '[');
    str = str.replace(/<\/i><\/b>/g, ']');

    result.from.text.value = str;

    if (body[5][0][5] === 1) {
      result.from.text.autoCorrected = true;
    } else {
      result.from.text.didYouMean = true;
    }
  }

  return result;
}

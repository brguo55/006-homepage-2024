/*
作者: imsyy
主页：https://www.imsyy.top/
GitHub：https://github.com/imsyy/home
版权所有，请勿删除
*/

// ⚙️ CONFIG: Skip loading animation? Change to true to show page immediately
const SKIP_LOADING_ANIMATION = false;

// Vanilla JS function to hide loading (doesn't depend on jQuery)
function hideLoadingScreenNowVanilla() {
    const loadingBox = document.getElementById('loading-box');
    const bg = document.getElementById('bg');
    const cover = document.querySelector('.cover');
    const section = document.getElementById('section');
    
    if (loadingBox) {
        loadingBox.setAttribute('class', 'loaded');
    }
    if (bg) {
        bg.style.cssText = "transform: scale(1);filter: blur(0px);transition: ease 1.5s;";
    }
    if (cover) {
        cover.style.cssText = "opacity: 1;transition: ease 1.5s;";
    }
    if (section) {
        section.style.cssText = "transform: scale(1) !important;opacity: 1 !important;filter: blur(0px) !important";
    }
    console.log('✓ Loading screen hidden');
}

// If skipping animation, hide loading screen immediately
if (SKIP_LOADING_ANIMATION) {
    setTimeout(() => {
        hideLoadingScreenNowVanilla();
    }, 300);
}

// Hide loading on DOM ready (faster than window.load)
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded triggered');
    // Don't hide yet - wait for resources, but log it
});

//弹窗样式
if (typeof iziToast !== 'undefined') {
    iziToast.settings({
        timeout: 10000,
        progressBar: false,
        close: false,
        closeOnEscape: true,
        position: 'topCenter',
        transitionIn: 'bounceInDown',
        transitionOut: 'flipOutX',
        displayMode: 'replace',
        layout: '1',
        backgroundColor: '#00000040',
        titleColor: '#efefef',
        messageColor: '#efefef',
        icon: 'Fontawesome',
        iconColor: '#efefef',
    });
} else {
    console.warn('iziToast not loaded yet');
}

/* 鼠标样式 */
const body = document.querySelector("body");
const element = document.getElementById("g-pointer-1");
const element2 = document.getElementById("g-pointer-2");

// Safety check: only initialize pointer tracking if elements exist
if (element && element2) {
    const halfAlementWidth = element.offsetWidth / 2;
    const halfAlementWidth2 = element2.offsetWidth / 2;

    function setPosition(x, y) {
        element2.style.transform = `translate(${x - halfAlementWidth2 + 1}px, ${y - halfAlementWidth2 + 1}px)`;
    }

    body.addEventListener('mousemove', (e) => {
        window.requestAnimationFrame(function () {
            setPosition(e.clientX, e.clientY);
        });
    });
}

// ========== JQUERY-DEPENDENT CODE STARTS HERE ==========
// All code below requires jQuery to be loaded
if (typeof $ === 'undefined') {
    console.warn('jQuery not available, skipping jQuery-dependent code');
} else {



//Function to hide loading screen
function hideLoadingScreen() {
    clearTimeout(loadingTimer); // Cancel fallback timeout if page loads normally
    
    try {
        // Try jQuery first if available
        if (typeof $ !== 'undefined' && $) {
            $('#loading-box').attr('class', 'loaded');
            $('#bg').css("cssText", "transform: scale(1);filter: blur(0px);transition: ease 1.5s;");
            $('.cover').css("cssText", "opacity: 1;transition: ease 1.5s;");
            $('#section').css("cssText", "transform: scale(1) !important;opacity: 1 !important;filter: blur(0px) !important");
            console.log('✓ Loading hidden with jQuery');
        } else {
            // Fallback to vanilla JS
            hideLoadingScreenNowVanilla();
            console.log('✓ Loading hidden with vanilla JS');
        }
    } catch (error) {
        console.error('Error in hideLoadingScreen:', error);
        // Force fallback
        hideLoadingScreenNowVanilla();
    }

    //用户欢迎
    try {
        setTimeout(function () {
            if (typeof iziToast !== 'undefined') {
                iziToast.show({
                    timeout: 2500,
                    icon: false,
                    title: (typeof hello !== 'undefined' ? hello : 'Welcome'),
                    message: 'Welcome to my homepage'
                });
            }
        }, 800);
    } catch (error) {
        console.log('iziToast not ready yet');
    }

    //中文字体缓加载-此处写入字体源文件 （暂时弃用）
    //先行加载简体中文子集，后续补全字集
    //由于压缩过后的中文字体仍旧过大，可转移至对象存储或 CDN 加载
    // const font = new FontFace(
    //     "MiSans",
    //     "url(" + "./font/MiSans-Regular.woff2" + ")"
    // );
    // document.fonts.add(font);

    //移动端去除鼠标样式
    try {
        if (typeof $ !== 'undefined' && $ && Boolean(window.navigator.userAgent.match(/AppWebKit.*Mobile.*/))) {
            $('#g-pointer-2').css("display", "none");
        }
    } catch (error) {
        console.log('Mobile optimization skipped');
    }
}

//加载完成后执行
window.addEventListener('load', function () {
    console.log('✓ Window load event fired');
    hideLoadingScreen();
}, false);

// Fallback: Force hide loading screen after 5 seconds - AGGRESSIVE
let loadingTimer = setTimeout(function() {
    console.warn('⚠️ 5 second timeout reached - forcing loading screen to hide');
    hideLoadingScreenNowVanilla();
}, 5000);

setTimeout(function () {
    $('#loading-text').html("As you might know, loading fonts and files may take some time…")
}, 3000);

// 新春灯笼 （ 需要时可取消注释 ）
// new_element=document.createElement("link");
// new_element.setAttribute("rel","stylesheet");
// new_element.setAttribute("type","text/css");
// new_element.setAttribute("href","./css/lantern.css");
// document.body.appendChild(new_element);

// new_element=document.createElement("script");
// new_element.setAttribute("type","text/javascript");
// new_element.setAttribute("src","./js/lantern.js");
// document.body.appendChild(new_element);

//获取一言
const fetchWithTimeout = (url, timeout = 5000) => {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
        )
    ]);
};

fetchWithTimeout('https://v1.hitokoto.cn?max_length=24')
    .then(response => response.json())
    .then(data => {
        if (data && data.hitokoto) {
            $('#hitokoto_text').html(data.hitokoto)
            $('#from_text').html(data.from)
        }
    })
    .catch(error => {
        console.log('Hitokoto API failed:', error.message);
        // Continue page loading even if API fails
    })

let times = 0;
$('#hitokoto').click(function () {
    if (times == 0) {
        times = 1;
        let index = setInterval(function () {
            times--;
            if (times == 0) {
                clearInterval(index);
            }
        }, 1000);
        fetchWithTimeout('https://v1.hitokoto.cn?max_length=24')
            .then(response => response.json())
            .then(data => {
                if (data && data.hitokoto) {
                    $('#hitokoto_text').html(data.hitokoto)
                    $('#from_text').html(data.from)
                }
            })
            .catch(error => {
                console.log('Hitokoto API failed:', error.message);
            })
    } else {
        iziToast.show({
            timeout: 1000,
            icon: "fa-solid fa-circle-exclamation",
            message: 'You clicked too fast.'
        });
    }
});

//获取天气
//请前往 https://www.mxnzp.com/doc/list 申请 app_id 和 app_secret
//请前往 https://dev.qweather.com/ 申请 key
const add_id = "vcpmlmqiqnjpxwq1"; // app_id
const app_secret = "PeYnsesgkmK7qREhIFppIcsoN0ZShv3c"; // app_secret
const key = "691d007d585841c09e9b41e79853ecc2" // key
function getWeather() {
    fetchWithTimeout("https://www.mxnzp.com/api/ip/self?app_id=" + add_id + "&app_secret=" + app_secret)
        .then(response => response.json())
        .then(data => {
            if (data && data.data && data.data.city) {
                let str = data.data.city
                let city = str.replace(/市/g, '')
                console.log(data,"sssss")
                $('#city_text').html(city);
                return fetchWithTimeout("https://geoapi.qweather.com/v2/city/lookup?location=" + city + "&number=1&key=" + key);
            }
        })
        .then(response => response.json())
        .then(location => {
            if (location && location.location && location.location[0]) {
                let id = location.location[0].id
                return fetchWithTimeout("https://devapi.qweather.com/v7/weather/now?location=" + id + "&key=" + key);
            }
        })
        .then(response => response.json())
        .then(weather => {
            if (weather && weather.now) {
                $('#wea_text').html(weather.now.text)
                $('#tem_text').html(weather.now.temp + "°C&nbsp;")
                $('#win_text').html(weather.now.windDir)
                $('#win_speed').html(weather.now.windScale + "级")
            }
        })
        .catch(error => {
            console.log('Weather API failed:', error.message);
            // Continue page loading even if weather API fails
        });
}

// getWeather();

// let wea = 0;
// $('#upWeather').click(function () {
//     if (wea == 0) {
//         wea = 1;
//         let index = setInterval(function () {
//             wea--;
//             if (wea == 0) {
//                 clearInterval(index);
//             }
//         }, 60000);
//         getWeather();
//         iziToast.show({
//             timeout: 2000,
//             icon: "fa-solid fa-cloud-sun",
//             message: 'Real-time weather updated'
//         });
//     } else {
//         iziToast.show({
//             timeout: 1000,
//             icon: "fa-solid fa-circle-exclamation",
//             message: 'Please update again later'
//         });
//     }
// });

//获取时间
let t = null;
t = setTimeout(time, 1000);

function time() {
    clearTimeout(t);
    dt = new Date();
    let y = dt.getYear() + 1900;
    let mm = dt.getMonth() + 1;
    let d = dt.getDate();
    let weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = dt.getDay();
    let h = dt.getHours();
    let m = dt.getMinutes();
    let s = dt.getSeconds();
    if (h < 10) {
        h = "0" + h;
    }
    if (m < 10) {
        m = "0" + m;
    }
    if (s < 10) {
        s = "0" + s;
    }
    $("#time").html(y + "&nbsp;/&nbsp;" + mm + "&nbsp;/&nbsp;" + d + "&nbsp;/&nbsp;" + "<span class='weekday'>" + weekday[day] + "</span><br>" + "<span class='time-text'>" + h + ":" + m + ":" + s + "</span>");
    t = setTimeout(time, 1000);
}

//链接提示文字
$("#social").mouseover(function () {
    $("#social").css({
        "background": "rgb(0 0 0 / 25%)",
        'border-radius': '6px',
        "backdrop-filter": "blur(5px)"
    });
    $("#link-text").css({
        "display": "block",
    });
}).mouseout(function () {
    $("#social").css({
        "background": "none",
        "border-radius": "6px",
        "backdrop-filter": "none"
    });
    $("#link-text").css({
        "display": "none"
    });
});

$("#linkedin").mouseover(function () {
    $("#link-text").html("Connet on my LinkedIn!");
}).mouseout(function () {
    $("#link-text").html("Link to my LinkedIn");
});

$("#github").mouseover(function () {
    $("#link-text").html("Check out my Github!");
}).mouseout(function () {
    $("#link-text").html("Link to my Github");
});

$("#email").mouseover(function () {
    $("#link-text").html("Wanna send me an email?");
}).mouseout(function () {
    $("#link-text").html("Link to send me an email.");
});

$("#instagram").mouseover(function () {
    $("#link-text").html("Peek on my Instagram!");
}).mouseout(function () {
    $("#link-text").html("Link to my Instagram");
});

$("#bilibili").mouseover(function () {
    $("#link-text").html("Visit my Bilibili!");
}).mouseout(function () {
    $("#link-text").html("Link to my Bilibili");
});

$("#douban").mouseover(function () {
    $("#link-text").html("Join me on Douban!");
}).mouseout(function () {
    $("#link-text").html("Link to my Douban");
});



//自动变灰
let myDate = new Date;
let mon = myDate.getMonth() + 1;
let date = myDate.getDate();
let days = ['4.4', '5.12', '7.7', '9.9', '9.18', '12.13'];
for (let day of days) {
    let d = day.split('.');
    if (mon == d[0] && date == d[1]) {
        document.write(
            '<style>html{-webkit-filter:grayscale(100%);-moz-filter:grayscale(100%);-ms-filter:grayscale(100%);-o-filter:grayscale(100%);filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);_filter:none}</style>'
        );
        $("#change").html("Silence&nbsp;in&nbsp;silence");
        $("#change1").html("今天是中国国家纪念日，全站已切换为黑白模式");
        window.addEventListener('load', function () {
            setTimeout(function () {
                iziToast.show({
                    timeout: 14000,
                    icon: "fa-solid fa-clock",
                    message: '今天是中国国家纪念日'
                });
            }, 3800);
        }, false);
    }
}

//更多页面切换
let shoemore = false;
$('#switchmore').on('click', function () {
    shoemore = !shoemore;
    if (shoemore && $(document).width() >= 990) {
        $('#container').attr('class', 'container mores');
        $("#change").html("Oops&nbsp;!");
        $("#change1").html("Oops, you found this out (click again to close)");
    } else {
        $('#container').attr('class', 'container');
        $("#change").html("Hello&nbsp;World&nbsp;!");
        $("#change1").html("A small website built in the 21st century, surviving on the edge of the Internet");
    }
});

//更多页面关闭按钮
$('#close').on('click', function () {
    $('#switchmore').click();
});

//移动端菜单栏切换
let switchmenu = false;
$('#switchmenu').on('click', function () {
    switchmenu = !switchmenu;
    if (switchmenu) {
        $('#row').attr('class', 'row menus');
        $("#menu").html("<i class='fa-solid fa-xmark'></i>");
    } else {
        $('#row').attr('class', 'row');
        $("#menu").html("<i class='fa-solid fa-bars'></i>");
    }
});

//更多弹窗页面
$('#openmore').on('click', function () {
    $('#box').css("display", "block");
    $('#row').css("display", "none");
    $('#more').css("cssText", "display:none !important");
});
$('#closemore').on('click', function () {
    $('#box').css("display", "none");
    $('#row').css("display", "flex");
    $('#more').css("display", "flex");
});

//监听网页宽度
window.addEventListener('load', function () {
    window.addEventListener('resize', function () {
        //关闭移动端样式
        if (window.innerWidth >= 600) {
            $('#row').attr('class', 'row');
            $("#menu").html("<i class='fa-solid fa-bars'></i>");
            //移除移动端切换功能区
            $('#rightone').attr('class', 'row rightone');
        }

        if (window.innerWidth <= 990) {
            //移动端隐藏更多页面
            $('#container').attr('class', 'container');
            $("#change").html("Hello&nbsp;World&nbsp;!");
            $("#change1").html("一个建立于 21 世纪的小站，存活于互联网的边缘");

            //移动端隐藏弹窗页面
            $('#box').css("display", "none");
            $('#row').css("display", "flex");
            $('#more').css("display", "flex");
        }
    })
})

//移动端切换功能区
let changemore = false;
$('#changemore').on('click', function () {
    changemore = !changemore;
    if (changemore) {
        $('#rightone').attr('class', 'row menus mobile');
    } else {
        $('#rightone').attr('class', 'row menus');
    }
});

//更多页面显示关闭按钮
$("#more").hover(function () {
    $('#close').css("display", "block");
}, function () {
    $('#close').css("display", "none");
})

//屏蔽右键
document.oncontextmenu = function () {
    if (typeof iziToast !== 'undefined') {
        iziToast.show({
            timeout: 2000,
            icon: "fa-solid fa-circle-exclamation",
            message: 'For the browsing experience, this site disables right click'
        });
    }
    return false;
}

} // END of jQuery-dependent code block


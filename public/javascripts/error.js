const fullScreen = document.querySelector('.full-screen')
const eye1 = document.querySelector('#eye1')
const eye2 = document.querySelector('#eye2')
let a1, a2

//宣告左眼圓心(X1,Y1)、右眼圓心(X2,Y2)
const X1 = 757, Y1 = 161,  X2 = 860, Y2= 161

try {
  fullScreen.addEventListener('mousemove', (event) => {
    //  獲取滑鼠座標
    const x = event.clientX
    const y = event.clientY
    
    //  計算弧度
    a1 = Math.atan2(y - Y1, x - X1)
    a2 = Math.atan2(y - Y2, x - X2)

    //  計算角度並以垂直軸為基準
    const rot1 = a1 * 180 / Math.PI + 90
    const rot2 = a2 * 180 / Math.PI + 90
    
    //  更新左眼、右眼的值
    eye1.style.transform = `rotate(${rot1}deg)`
    eye2.style.transform = `rotate(${rot2}deg)`
  })
} catch {}

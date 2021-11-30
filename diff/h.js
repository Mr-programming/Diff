import vnode from './vnode.js'
//低配h函数，接受三个参数
//形态1：h('div',{},文字)
//形态2：h('div',{},[])
//形态3：h('div',{},h())

//正版的h函数参数个数不受限制，
//三个参数的情况 sel data children|text
//两个参数的情况 sel children|text 或者 sel,data

//虚拟dom就是一个js对象
//h函数通过我们传入的三个参数最终返回一个虚拟dom(利用了vnode函数)
export default function(sel,data,c){
  //检查参数个数：
  if(arguments.length!==3){
    throw new Error('对不起 ,需要三个参数 ')
  }
  if(typeof c=='string'||typeof c=='number'){
    return vnode(sel,data,undefined,c,undefined)
  }else if(Array.isArray(c)){
    //传入的数组里面都是函数，这些函数会直接调用，将返回结果传回数组，所以这里直接将数组正常传入即可
    //传入的也可能是空数组
    return vnode(sel,data,c,undefined,undefined)
  }else if(typeof c=='object'&&c.hasOwnProperty('sel')){
    //如果传入的children只有一个函数，并且没有用数组包裹，那么我们将他的返回结果用数组包裹
    return vnode(sel,data,[c],undefined,undefined)

  }else{
    throw new ErrorEvent('传入的第三个参数类型不对')
  }
}
import creatElement from './CreatElement.js'
import vnode from './vnode.js'
import patchVnode  from './patchVnode.js'
import sameVnode from './sameVnode.js'
export default function(oldVnode,newVnode){
  //判断第一个参数是不是虚拟节点
  if(!oldVnode.sel){
    //没有sel属性 不是虚拟节点,把他转换成虚拟节点
    oldVnode=vnode(oldVnode.tagName.toLowerCase(),{},[],undefined,oldVnode)
  }
  //判断是否为同一个节点
  //是同一个
  if(sameVnode(oldVnode,newVnode)){
    patchVnode(oldVnode,newVnode)
  }else{
    //不是同一个，开始暴力
    console.log('不是同一个，开始暴力')
    //创建子节点的DOM
    let newNodeElm= creatElement(newVnode)
    //这里的旧节点要么本来不是虚拟节点但经过转化后被设置了elm属性，要么是原本是虚拟节点但已经被被创建过子节点(设置了eml属性)插入DOM中
    if(oldVnode.elm.parentNode&&newNodeElm){
      oldVnode.elm.parentNode.insertBefore(newNodeElm,oldVnode.elm)
      console.log(newNodeElm)
    }
    //删除DOM中的旧结点
    //这种暴力情况，最后新节点的dom会替换旧dom，同时这个dom是和新节点elm本来就是对应的，不需要指定
    oldVnode.elm.parentNode.removeChild(oldVnode.elm)
  }
}
export default function CreatElement(Vnode){
  //将虚拟节点及其后代转换成dom结点
  let DomNode=document.createElement(Vnode.sel)
  //内容是纯文本并且无子节点的情况
  if(Vnode.text!=''&&(Vnode.children==undefined||Vnode.children.length==0)){
       DomNode.innerText=Vnode.text
  }else if(Array.isArray(Vnode.children)&&(Vnode.children.length!==0) ){
    // 有子节点的情况，循环遍历数组中每一个子虚拟dom
      for(let i=0;i<Vnode.children.length;i++){
          let ch=Vnode.children[i]
          //递归的思想，再次调用本方法，返回值是子节点的真实DOM
          let childElm=CreatElement(ch)
          //往父结点(真实DOM)上追加子DOM
          DomNode.appendChild(childElm)
      }
  }
  //Vnode虚拟节点的elm属性是在这里赋值的，赋值为真实DOM对象（此方法就是一个创建真实DOM的方法）
  Vnode.elm=DomNode
  //每次函数返回的 是由传入的虚拟节点生成的真实DOM结点(这个值结点对象赋给了elm属性)
  return Vnode.elm
}
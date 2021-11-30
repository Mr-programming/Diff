import creatElement from './CreatElement.js'
import updateChildren from './updateChildren.js'
export default function patchVnode(oldVnode,newVnode){
  console.log('是同一个节点')
  //在原本path函数中两个节点不同的情况下是对新节点直接创建真实dom并赋值给elm，将真实dom添加到DOM树
  //但在此函数中是新旧节点相同做精细化对比的情况，把newVnode的elm指向oldVnode的elm(真实dom对象)，然后对应着newVnode去修改原本的oldVnode对应的Dom对象，也是当前newVnode的elm，
  //修改完后就不用管了，因为newVnode的elm已经在Dom树上，旧的oldVnode就不用管了

  newVnode.elm=oldVnode.elm
  //如果二者指向同一个内存对象直接不用管了
  if(oldVnode===newVnode){
    console.log('二者指向同一个对象')
    return
  }
  //判断新结点是否有文本属性(h函数要么有文本要么有数组二选一)
  //如果有
  if(newVnode.text){
    console.log('新节点有文本属性')
    //判断新节点的text是否和旧的相同，如果相同不用管，如果不同直接替换innertTxt(如果旧的里面没有text也视为不同，一样的结果)
    if(!(newVnode.text===oldVnode.text)){
      console.log('将旧节点的innerText替换成新节点的text',newVnode.text)
      oldVnode.elm.innerText=newVnode.text
    }else{
      console.log('新旧节点的文本属性一样')
    }
  }else{
    //新节点没有text，那么就有children属性，此时要判断旧节点是children还是text
    console.log('新节点有children属性')
    if(oldVnode.children&&oldVnode.children.length>0){
      console.log('旧节点也有children属性')
      
      updateChildren(oldVnode.elm,oldVnode.children,newVnode.children)
    }else{
        console.log('旧节点并没有children属性')
      //清空旧节点文本,
      oldVnode.elm.innerHTML=''
      //将新节点的children一个个appendChild上去
      for(let i=0;i<newVnode.children.length;i++){
        let domel= creatElement(newVnode.children[i])
        oldVnode.elm.appendChild(domel)
      }
    }
  }
}
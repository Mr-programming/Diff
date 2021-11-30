import patchVnode from "./patchVnode.js"
import CreatElement from "./CreatElement.js"
import sameVnode from "./sameVnode.js"
export default function updateChildren(parentElm,oldCh,newCh){

  //旧前
  let oldStartIdx=0
  //旧后
  let oldEndIdx=oldCh.length-1
  //新前
  let newStartIdx=0
    //新后
  let newEndIdx=newCh.length-1
  //旧前节点
  let oldStartVnode=oldCh[0]
  //旧后节点
  let oldEndVnode=oldCh[oldCh.length-1]
  //新前节点
  let newStartVnode=newCh[0]
  //新后结点
  let newEndVnode=newCh[newCh.length-1]
  //初始化为null
  let keyMap=null
  //一经patchVnode函数处理过的newVnode(新虚拟dom)的elm和oldVnode的elm指向同一个真实DOM
  while(oldStartIdx<=oldEndIdx&&newStartIdx<=newEndIdx){
      if (oldStartVnode == null) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left这种情况可能已经被移动并被标记了
    }
    else if (oldEndVnode == null) {
        oldEndVnode = oldCh[--oldEndIdx];
    }
    else if (newStartVnode == null) {
        newStartVnode = newCh[++newStartIdx];
    }
    else if (newEndVnode == null) {
        newEndVnode = newCh[--newEndIdx];
    }
    //新前与旧前
    if(sameVnode(oldStartVnode,newStartVnode)){
      patchVnode(oldStartVnode,newStartVnode)
      oldStartVnode=oldCh[++oldStartIdx]
      newStartVnode=newCh[++newStartIdx]
      console.log('新前与旧前')
    }else if(sameVnode(oldEndVnode,newEndVnode)){
    //新后和旧后
      patchVnode(oldEndVnode,newEndVnode)
      oldEndVnode=oldCh[--oldEndIdx]
      newEndVnode=newCh[--newEndIdx]
      console.log('新后与旧后')
    }else if(sameVnode(oldStartVnode,newEndVnode)){
      //新后与旧前
      patchVnode(oldStartVnode,newEndVnode)
      //经过patchVnode处理后，新旧Vnode的elm指向相同的Dom，并且这个dom也是按照新的Vnode处理过的
      //但是dom节点所处的位置需要按照新的newEndVnode的位置重新插入Dom树
      //插在旧后指针指向的节点的下一个节点之前
      parentElm.insertBefore(oldStartVnode.elm,oldEndVnode.elm.nextSibling)
      oldStartVnode=oldCh[++oldStartIdx]
      newEndVnode=newCh[--newEndIdx]
      console.log('新后与旧前 ')
    }else if(sameVnode(oldEndVnode,newStartVnode)){
      patchVnode(oldEndVnode,newStartVnode)
      //经过patchVnode处理后，新旧Vnode的elm指向相同的Dom，并且这个dom也是按照新的Vnode处理过的
      //但是dom节点所处的位置需要按照新的newEndVnode的位置重新插入Dom树
      //插在旧前指针指向的节点之前
      parentElm.insertBefore(oldEndVnode.elm,oldStartVnode.elm)
      oldEndVnode=oldCh[--oldEndIdx]
      newStartVnode=newCh[++newStartIdx]
      console.log('新前与旧后 ')
    }else{
      console.log(123456)
      //四种命中都没有命中的情况需要 创建map集合保存剩余旧节点的key和索引 
      //四种命中都没有命中，就按正常顺序查找当前newStartVnode在集合中有没有相同的key，这里遍历整个集合，
      //如果找到了并且sel相同，那么就执行patchVnode，传入oldVnodeTomove，然后还是移动节点，因为是要和新的Vnode相对应的，所以将DOM在dom树中移动到oldStartVnode所对应的dom节点的上一个
      //但是此时处理的oldVnodeTomove，在四个指针中间的部分，还未处理，所以以后指针再次移动到oldVnodeTomove的位置，要让指针自动往中间移动一位
      //所以要给处理过的oldVnodeTomve做一个标记，设置为undefined，也就是原oldCh中这个元素设置为undefined，下次再次移动指针直接跳过去
      //这里的逻辑和后两种命中情况都会涉及到移动dom 但是，前四种命中都是处理过新旧Vnode后，指针按顺序往中间移动，继续处理下一个Vnode，处理过的旧的Vnode就不用管了。也不需要标记

      //keyMap被初始化一次即可，当它为null的时候初始化，之后还需要查找的情况直接在里面查找就好
      if(!keyMap){
        keyMap={}
        //第一次遇到找不到的情况将还没有处理的新节点的key(不为undifined)和索引存储
        for(let i=oldStartIdx;i<=oldEndIdx;i++){
          const key=oldCh[i].key
          if(key!=undefined){
            keyMap[key]=i
            console.log(i)
          }
        }
      }
      //在里面查找,如果找到了返回索引
      let idxOld=keyMap[newStartVnode.key]
      if(idxOld){
          //找到的情况
          console.log(idxOld)
          let oldVnodeTomove=oldCh[idxOld]
          //找到后只是key相同，还要判断是否同一个节点(key和sel相同)
          if(oldVnodeTomove.sel===newStartVnode.sel){
            patchVnode(oldVnodeTomove,newStartVnode)
            parentElm.insertBefore(oldVnodeTomove.elm,oldStartVnode.elm)
            //留下标记证明已经处理过
            oldCh[idxOld]=undefined
          }else{
            //没找到的情况
            const newElm= CreatElement(newStartVnode)
            //执行CreatElement方法在创建DOM的同时会为Vnode的elm添加Dom对象
            parentElm.insertBefore(newElm,oldStartVnode.elm)
          }
      }else{
        //没找到的情况
        const newElm= CreatElement(newStartVnode)
        parentElm.insertBefore(newElm,oldStartVnode.elm)
      }
      //移动指向newStartVnode的指针
      newStartVnode=newCh[++newStartIdx]
    }
  }
  //跳出循环后

  //如果还有剩余的新的节点，需要把他们插入到Dom树种，这里剩余的新的节点都是没有生成真实dom对象给elm的但是其他的已经处理过的节点都是有这个属性对应着真实dom的
  if(newStartIdx<=newEndIdx){
    //可能newEndIdx始终为指向最后一个，他的下一个就是null,而null是不可以用.语法的 所以这里啰嗦了一步
    let before= newCh[newEndIdx+1]===null?null:newCh[newEndIdx+1].elm
    while(newStartIdx<=newEndIdx){
      parentElm.insertBefore(CreatElement(newCh[newStartIdx++]),before)
    }
  }
  //如果还有剩余的旧的节点那么就都给删除掉
  if(oldStartIdx<=oldEndIdx){
    //可能newEndIdx始终为指向最后一个，他的下一个就是null,而null是不可以用.语法的所以这里啰嗦了一步
    while(oldStartIdx<=oldEndIdx){
      //旧的节点可能会有被处理过而被标记为undefined的了，直接跳过
      if(oldCh[oldStartIdx]===undefined)
      {
        oldStartIdx++
        continue
      }
      parentElm.removeChild(oldCh[oldStartIdx++].elm)
    }
  }
}
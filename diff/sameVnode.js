export default function (oldVnode,newVnode){
 return oldVnode.sel===newVnode.sel&&oldVnode.key===newVnode.key
}
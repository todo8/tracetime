export function someMutation (/* state */) {
    
}
export function login(state , data){
    state.uid = data._id ;
    state.username = data.username ;
    state.head = data.head ;
    state.email = data.email ;
}
// export function uid(state , id){
//     state.uid = id ;
// }
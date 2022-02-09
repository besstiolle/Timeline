<script lang="ts">

    let timeout = null
    let toast


    export function show(content: string, success:boolean = true, timer:number = 3) {
        clearTimeout(timeout)
        
        if(success){
            toast.classList.add("success")
        } else {
            toast.classList.add("error")
        }
        toast.innerHTML = content
        if(timer > 0){
            toast.classList.add("show")
            timeout = setTimeout(function(){ hide() }, timer * 1000)
        } else {
            toast.classList.add("showAndPersist")
        }
    }

    function hide(){
        clearTimeout(timeout)
        toast.classList.remove("show")
        toast.classList.remove("showAndPersist")
        toast.classList.remove("success")
        toast.classList.remove("error")
        toast.innerHTML = 'N/A'
    }

</script>

<div bind:this={toast} on:click={hide}></div>

<style>

div {
  visibility: hidden; 
  min-width: 250px; 
  max-width: 250px; 
  margin-left: -125px; 
  background-color: rgb(22, 160, 133); 
  border: 1px solid rgb(17, 122, 101);
  color: #333; 
  font-weight: bold;
  text-align: center; 
  border-radius: 10px;
  padding: 16px; 
  position: fixed; 
  z-index: 1; 
  left: 50%; 
  bottom: 30px; 
  cursor: pointer;
  word-wrap: break-word;
}

:global(div.show) {
  visibility: visible; 
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

:global(div.showAndPersist) {
  visibility: visible; 
  -webkit-animation: fadein 0.5s;
  animation: fadein 0.5s;
}

:global(div.error) {
    background-color: rgb(204,51,0);
    border: 1px solid rgb(255,153,102);
    color:#CCC;
}

@-webkit-keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
} 
</style>
<script lang="ts">

    let timeout:any
    let toast:HTMLElement


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

<div bind:this={toast} on:click={hide} on:keydown={hide} role="button" tabindex="0"></div>

<style>

div {
  visibility: hidden; 
  min-width: 20vw; 
  max-width: 20vw; 
  background-color: rgb(22, 160, 133); 
  border: 1px solid rgb(17, 122, 101);
  color: #333; 
  font-weight: bold;
  text-align: center; 
  border-radius: 10px;
  padding: 16px; 
  position: fixed; 
  z-index: 1;
  left: 40vw;
  bottom: 2vh;
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
</style>
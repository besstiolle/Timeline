<script lang="ts">

    let popup:HTMLElement
    let background:HTMLElement

    let _message:string
    let _validation:Function
    let _validationText:string
    let _validationArgs:any[]
    let _cancelation:Function
    let _cancelationText:string
    let _cancelationArgs:any[]


    export function show(message: string, validation:Function, validationText:string, validationArgs:any[], cancelation:Function, cancelationText:string, cancelationArgs:any[]) {
      popup = document.getElementById("popup")
      background = document.getElementById("background")
      popup.classList.add("show")
      background.classList.add("show")

      _message = message
      _validation = validation
      _validationText = validationText
      _validationArgs = validationArgs
      _cancelation = cancelation
      _cancelationText = cancelationText
      _cancelationArgs = cancelationArgs
    }

    function doValidation(){
      popup.classList.remove("show")
      background.classList.remove("show")
      _validation(_validationArgs)
    }

    function doCancelation(){
      popup.classList.remove("show")
      background.classList.remove("show")
      _cancelation(_cancelationArgs)
    }

</script>
<div id='background'></div>
<div id='popup'>
  <div class="content">{_message}</div>
  <button class="validation" on:click={doValidation}>{_validationText}</button>
  <button class="cancelation" on:click={doCancelation}>{_cancelationText}</button>
</div>
<style>

#background{
  visibility: hidden; 
  background-color: rgb(0,0,0,0.8);
  height: 100%;
  width: 100%;
  position: fixed;
  top:0px;
  left: 0px;
}

#popup {
  visibility: hidden; 
  width: 100%;
  background-color: #e5edf1;
  text-align: center; 
  position: fixed; 
  z-index: 1;
  bottom: 50%;
}

:global(#background.show, #popup.show) {
  visibility: visible; 
}

.content{
  color: #333; 
  font-weight: bold;
  font-size: 1.3em;
  margin:30px;
}

button{
  background-color: rgb(188, 224, 154);
  border-radius: 2px;
  border: 0px none;
  margin:0;
  padding: 5px 10px;
  cursor: pointer;
  margin-bottom: 20px;
}
button.cancelation{
  background-color: rgb(163, 173, 154);
}
button:hover{
  transform: scale(1.05);
}
</style>
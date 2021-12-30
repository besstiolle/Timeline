<script lang="ts">
    var myClass = false

    function close(){
        console.info("close")
        myClass = false
    }

    function open(){
        console.info("open")
        myClass = true
    }

</script>

<button on:click={open}>
    Click me to open my friend
</button>

<button on:click={close} class:myClass>
    Click me to close myself
</button>

<style>
.myClass{
    color:red
}
</style>
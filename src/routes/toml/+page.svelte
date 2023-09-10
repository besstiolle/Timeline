
<script lang="ts">
import { CustomLocalStorage } from '$lib/customLocalStorage';
import { Struct } from '$lib/struct.class';
import { goToml } from '$lib/toml';

import toml from 'toml'

let result
try {
  result = toml.parse(`# This is a TOML document. Boom.

title = "TOML Example"
foo = "bar"

[owner]
name = "Tom Preston-Werner"
organization = "GitHub"
bio = "GitHub Cofounder & CEO\n\tLikes 'tater tots' and beer and backslashes: "
dob = 1979-05-27T07:32:00Z # First class dates? Why not?

[database]
server = "192.168.1.1"
ports = [ 8001, 8001, 8003 ]
connection_max = 5000
connection_min = -2 # Don't ask me how
max_temp = 87.1 # It's a float
min_temp = -17.76
enabled = true

[servers]

  # You can indent as you please. Tabs or spaces. TOML don't care.
  [servers.alpha]
  ip = "10.0.0.1"
  dc = "eqdc10"

  [servers.beta]
  ip = "10.0.0.2"
  dc = "eqdc10"

[clients]
data = [ ["gamma", "delta"], [1, 2] ] # just an update to make sure parsers support it

[[products]]
name = "Hammer"
sku = 738594937

[[products]]

[[products]]
name = "Nail"
sku = 284758393
color = "gray"

`)

//console.debug(result)
// The Exception return by the toml library is precisely "Error"
// See more : https://www.npmjs.com/package/toml?activeTab=code
//@ts-ignore
} catch (e: Error) {
  console.error("Parsing error on line " + e.line + ", column " + e.column +
    ": " + e.message);
}

let timeline = CustomLocalStorage.getTimeline('hGV53i5tDw')
if(!timeline){
    timeline = new Struct.Timeline("key","titre")
}

let s = new Date().getTime()
for(let i=0; i<1000; i++){
    goToml(timeline)
}
console.info((new Date().getTime() - s) + "ms")


</script>
<!--
<ul>
    <li>{result.title}</li>
    <li>{result.owner.name}</li>
    <li>{result.owner.dob.getFullYear()}</li>
    <li>{result.database.ports[0]}</li>
    
</ul>--><!--
<div>{@html goToml(result).replace(/\r\n/g, '<br/>').replace(/\t/g, '&nbsp;&nbsp;')}</div>
-->
<div>{@html goToml(timeline).replace(/\r\n/g, '<br/>').replace(/\t/g, '&nbsp;&nbsp;')}</div>



<style>
    div{
        width: 40%;
        margin: 10vh 10vh;
        display: inline-flex;
    }

</style>
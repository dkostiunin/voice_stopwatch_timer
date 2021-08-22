let dateObj,diff_time=0,pause_time,old_time=0,rez_s=document.getElementById('rezult'),count_sec,start_time=0,count_interval=1

function ClearСlock(){if(document.getElementById('start_sec')){start_sec.textContent=start_text};if(count_sec){clearTimeout(count_sec)};diff_time=0;
rez_s.textContent='00:00:00:00';old_time=0;if(document.getElementById('round')){round.remove()};start_time=0;count_interval=1} 

function StartTIME() {let cdateObj=new Date(),t=cdateObj.getTime()-dateObj.getTime()-diff_time	
	rez_s.textContent=get_time(t);count_sec=setTimeout("StartTIME()",10)	
}

function StartStop(){
	if(start_sec.textContent==start_text){start_sec.textContent=pause_text;dateObj = new Date();StartTIME(); let cdateObj=new Date()}
	else if(start_sec.textContent==pause_text){start_sec.textContent=wait_text;clearTimeout(count_sec);pause_time =Date.now()} 
	else if(start_sec.textContent==wait_text){start_sec.textContent=pause_text;diff_time=diff_time+(Date.now()-pause_time);StartTIME()}
}

function Interval(){	
	if(start_sec.textContent==pause_text){let end_time=rezult.textContent.split(':'),rez
		let end_time_mil_sec=Number(end_time[0])*3600*1000+Number(end_time[1])*60*1000+Number(end_time[2])*1000+Number(end_time[3]*10)		
		let d_time=end_time_mil_sec-start_time;start_time=end_time_mil_sec
		if(end_time[3]=='00'||end_time[3]=='0'){rez=`${end_time[0]}:${end_time[1]}:${end_time[2]}:00`}else{rez=rezult.textContent}
		if(!document.getElementById('round')){device_sec.insertAdjacentHTML('afterend',round_sec)}		
		rounds.insertAdjacentHTML('afterbegin',`<p>${count_interval} ${get_time(d_time)} ${rez}</p>`);count_interval++
		
	}
} 

function get_time(data){let d=new Date(data)
	return ('0'+d.getUTCHours()).slice(-2)+':'+('0'+d.getUTCMinutes()).slice(-2)+':'+('0'+d.getUTCSeconds()).slice(-2) + ':'+('0'+d.getUTCMilliseconds()).slice(-3,-1)	
}
//9971//<div>Время круга</div>
const device_s=`<div id="device_sec" class="device_but">
<button class="buttons control_but" onclick="ClearСlock()">&#10060</button>
<button class="buttons control_but" onclick="Interval()">&#127937</button>
<button class="buttons control_but start_pause" id = "start_sec" onclick="StartStop(this)">&#9654</button>
</div>`,
round_sec=`<div id="round">
<div id="round_head">
	<div id="round_child_1">№</div>
	<div>&#9971</div>
	<div>&#9202</div>
	</div>
	<div id="rounds"><div>
	</div>`
let timer_t,start_t,pause_t=0,pause_diff=0,rez=document.getElementById('rezult'),count_timer

function change_timer(){let now_d=Date.now(),val=timer_t-(now_d-start_t)+pause_diff;
	rez.textContent=get_time(val);count_timer=setTimeout("change_timer()",10)
	if(val<11){start_timer.textContent=start_text;clearTimeout(count_timer);pause_t=0;pause_diff=0;rez.textContent='00:00:00:00';soundClick()}	
} 

function startTimer(){console.log(start_timer.textContent.charCodeAt())
	if(start_timer.textContent==start_text){start_timer.textContent=pause_text;timer_t=Date.parse(`Thu, 01 Jan 1970 ${timer_time.value} GMT`);start_t=Date.now();change_timer()}
	else if(start_timer.textContent==pause_text){start_timer.textContent=wait_text;clearTimeout(count_timer);pause_t=Date.now()}
	else if(start_timer.textContent==wait_text){start_timer.textContent=pause_text;pause_diff=pause_diff+(Date.now()-pause_t);change_timer()}	
}

function ClearTimer(){start_timer.textContent=String.fromCharCode(9654);if(count_timer){clearTimeout(count_timer)};pause_t=0;pause_diff=0;rez.textContent='00:00:00:00'} 

function soundClick(){let audio = new Audio('./say/voice/signal.wav'); audio.autoplay = true}

const device_t=`<div id="device_time" class="device_but">
<button class="buttons control_but" id="reset_timer" onclick="ClearTimer()">&#10060;</button>
<input id="timer_time" type="time" onchange="change_value(this)" value="00:01:00" step="1">
<button class="buttons control_but start_stop" id="start_timer" onclick="startTimer()">&#9654</button>
</div>`
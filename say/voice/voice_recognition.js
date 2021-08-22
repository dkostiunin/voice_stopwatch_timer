const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition||window.mozSpeechRecognition||window.oSpeechRecognition 
const recognizer=new SpeechRecognition(),synth = window.speechSynthesis,socket = io();
const pause_text=String.fromCharCode(9724),start_text=String.fromCharCode(9654),wait_text=String.fromCharCode(9199)
let voice=[],isTrusted=true,starting,voice_sec,voice_timer,stoping,reseting,lap,speech_off,info_speech
recognizer.interimResults = false;recognizer.maxAlternatives=1

recognizer.onerror=(ev)=>{console.log('Speech recognition error detected: '+ev.error);socket.emit('chat',ev.error)}

recognizer.onresult = function (ev){let res = ev.results[0][0];	socket.emit('chat',[res.transcript]);
	if(reseting.includes(res.transcript)===true||stoping.includes(res.transcript)===true){
		if(document.getElementById('device_sec')){
			if(reseting.includes(res.transcript)===true){ClearСlock()}
			else if(stoping.includes(res.transcript)===true&&start_sec.textContent==pause_text){StartStop();talk('Прошло '+split_text())}
		}
		else if(document.getElementById('device_time')){
			if(reseting.includes(res.transcript)===true){ClearTimer()}
			else if(stoping.includes(res.transcript)===true&&start_timer.textContent==pause_text){startTimer();talk('Осталось '+split_text())}
		}
		else{talk(info_speech)}
	}
	else if(starting.includes(res.transcript)===true){
		if(document.getElementById('device_sec')&&start_sec.textContent!=pause_text){StartStop();talk(res.transcript)}
		if(document.getElementById('device_time')&&start_timer.textContent!=pause_text){startTimer();talk(res.transcript)}
		else if(!document.getElementById('device_time')&&!document.getElementById('device_sec')){talk(info_speech)}
	}
	else if(lap.includes(res.transcript)===true){Interval();talk(res.transcript)}
	else if(speech_off.includes(res.transcript)===true&&speech_on_off_child.style.display!=='initial'){speech('ON');talk('Выключил')}
	else if(voice_sec.includes(res.transcript)===true&&!document.getElementById('device_sec')){change_device('STOPWATCH');talk(res.transcript)}
	else if(voice_timer.includes(res.transcript)===true&&!document.getElementById('device_time')){change_device('TIMER');talk(res.transcript)}
}

recognizer.onend=(ev)=>{console.log('disconnected',isTrusted);if(isTrusted){speech('OFF')}}

function speech(el){
	if((speech_on_off_child.style.display==='initial'||el==='OFF')&&el!=='ON'){speech_on_off_child.style.display='none';isTrusted=true;recognizer.start()}
	else{speech_on_off_child.style.display='initial';isTrusted=false;recognizer.abort()}
}

function talk(data){isTrusted=false;
	let messag = new SpeechSynthesisUtterance(data);messag.pitch=Number(pitch.value);messag.rate=Number(rate.value);	
	messag.voice=voice.filter(i=>i.name===voices[voices.value].textContent.slice(0,-6))[0]	
	synth.speak (messag);messag.onend=(ev)=>{if(speech_off.includes(data)!==true){speech('OFF')}}
}

function change_value(el){if(el.id==='rate'){value_rate.textContent=el.value;localStorage.setItem('rate',rate.value)}
	else if(el.id==='pitch'){value_pitch.textContent=el.value;localStorage.setItem('pitch',pitch.value)}
	else if(el.id==='voices'){localStorage.setItem('voice',voices.value);recognizer.lang=voices[voices.value].textContent.slice(-5)}
	else if(el.id==='timer_time'){localStorage.setItem('timer_time',el.value)}
}

function getVoice(){voice=speechSynthesis.getVoices();
	const v_list=voice.filter(i=>i.lang==='ru_RU'||i.lang==='ru-RU'||i.lang==='en_US'||i.lang==='en-US'||i.lang==='en_GB'||i.lang==='en-GB').map((v,i)=>`<option value=${i}>${v.name} ${v.lang}`).join('');	
	voices.innerHTML= v_list;
	if(localStorage.getItem('voice')){voices.value=localStorage.getItem('voice')}else{setTimeout(()=>{voices.value=0},1000)}
	recognizer.lang=voices[voices.value].textContent.slice(-5);
}



function change_device(el){
	if((el.id==='button_timer'||el==='TIMER')&&!document.getElementById('device_time')){let e=document.getElementById('device_sec');if(e){e.remove()};
		div_rezult.insertAdjacentHTML('afterend',device_t);button_sec.style.opacity=0.6;button_timer.style.opacity=1;ClearСlock()
		if(localStorage.getItem('timer_time')){timer_time.value=localStorage.getItem('timer_time')}
		if(document.getElementById('round')){round.remove();start_time=0;count_interval=1}
	}
	else if((el.id==='button_sec'||el==='STOPWATCH')&&!document.getElementById('device_sec')){let e=document.getElementById('device_time');
	if(e){e.remove()};if(count_timer){clearTimeout(count_timer)};div_rezult.insertAdjacentHTML('afterend',device_s);button_timer.style.opacity=0.6;button_sec.style.opacity=1;rez_s.textContent='00:00:00:00'}	
}

synth.addEventListener('voiceschanged',getVoice)

socket.on('chat',(data)=>{console.log(data)})

document.addEventListener('DOMContentLoaded',(e)=>{get_data('load_page');getVoice()})

function get_data(val){
	if(val==='load_page'){
		if(localStorage.getItem('starting')){starting=localStorage.getItem('starting').split(',')}
		else {starting=['Старт','старт','Start','start','Go','go','Го','го','гоу','Гоу','Google','google','продолжить','Продолжить','Сontinue','continue'];localStorage.setItem('starting',starting)}
		if(localStorage.getItem('voice_sec')){voice_sec=localStorage.getItem('voice_sec').split(',')}
		else {voice_sec=['секундомер','Секундомер','stopwatch','Stopwatch','stop watch','Stop watch'];localStorage.setItem('voice_sec',voice_sec)}
		if(localStorage.getItem('voice_timer')){voice_timer=localStorage.getItem('voice_timer').split(',')}
		else {voice_timer=['таймер','Таймер','timer','Timer'];localStorage.setItem('voice_timer',voice_timer)}
		if(localStorage.getItem('stoping')){stoping=localStorage.getItem('stoping').split(',')}
		else{stoping=['стоп','Стоп','Пауза','пауза','stop','Stop','Pause','pause','finish','Finish','Финиш','финиш'];localStorage.setItem('stoping',stoping)}
		if(localStorage.getItem('reseting')){reseting=localStorage.getItem('reseting').split(',')}
		else{reseting=['reset','Reset','Clear','clear','Drop','drop','Сбросить','сбросить','Очистить','очистить'];localStorage.setItem('reseting',reseting)}
		if(localStorage.getItem('lap')){lap=localStorage.getItem('lap').split(',')}
		else{lap=['Lap','lap','Round','round','Круг','круг','подход','Подход','Раунд','раунд'];localStorage.setItem('lap',lap)}
		if(localStorage.getItem('speech_off')){speech_off=localStorage.getItem('speech_off').split(',')}
		else{speech_off=['выключил','Выключил','Выключить','выключить','Speech off','speech off','Switch off','switch off'];localStorage.setItem('speech_off',speech_off)}
		if(localStorage.getItem('rate')){value_rate.textContent=localStorage.getItem('rate');rate.value=localStorage.getItem('rate')}
		if(localStorage.getItem('pitch')){value_pitch.textContent=localStorage.getItem('pitch');pitch.value=localStorage.getItem('pitch')}		
		setTimeout(()=>{			
			if(['en_US','en-US','en_GB','en-GB'].includes(voices[voices.value].textContent.slice(-5))===true){
				text_en.style.display='initial';flag_en.style.opacity=1;text_ru.style.display='none';flag_ru.style.opacity=0.6;
				info_speech='First, say "Stopwatch" or "Timer" to select the device'
			}
			else{info_speech='Сначала произнесите "Секундомер" или "Таймер" для выбора устройства'}
		},1000)
	}
}

function show_menu(el){
	if(el.id==='settings'){		
	main_menu.style.display==='none'?(main_menu.style.display='initial',settings.textContent='❌'):(main_menu.style.display='none',inf.style.display='initial',settings.textContent='≡',text_info.style.display='none')}
	else if(el.textContent==='?'){text_info.style.display='initial';inf.style.display='none'}
	else if(el.id==='flag_ru'&&text_ru.style.display==='none'){text_ru.style.display='initial';el.style.opacity=1;text_en.style.display='none';flag_en.style.opacity=0.6}
	else if(el.id==='flag_en'&&text_en.style.display==='none'){text_en.style.display='initial';el.style.opacity=1;text_ru.style.display='none';flag_ru.style.opacity=0.6}
}

function split_text(){
	let n=[],w=rez_s.textContent.split(':')
	if (w[0]!='00'){if (w[0][0]=='0'){w[0]=w[0][1]};n.push(w[0]+' часов')};if(w[1]!='00'){if (w[1][0]=='0'){w[1]=w[1][1]};n.push(w[1]+' минут')}
	if(w[2]!='00'){if (w[2][0]=='0'){w[2]=w[2][1]};n.push(w[2]+' секунд')};
	return n.join(' ')
}

/* let tex='Раз два три четыре пять, вышел зайчик погулять'
	let tex='reset'
function to_voice(){talk(tex)} */

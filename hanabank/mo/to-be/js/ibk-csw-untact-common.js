/*****************************************************************************
 * 파일명 : ibk-csw-untact-common.js
 * 작성일 : 2021. 03. 05
 * 작성자 : 
 * 설 명 : 비대면 공통
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/
var _addressCallBack = null;	// 주소 callBack


$(function(){
	// 상단 백버튼 클릭
	$(".back_btn").on("click",function(event){
		
		ibk.csw.common.openConfirm("서비스를 종료하시겠습니까?", function() {
			if(oPLATFORM.ANDROID()){
				ibk.csw.common.fnAppFinish(null);
			}else{
				location.href = "native://exit";
			}
			
		});
		
	});
	// 사이드 메뉴 클릭
	$('.h_menu').on("click",function(){
		layerOpen.init("#menuNav");
	});
	
});
ibk.csw.untact.common = function(){
			
	
	return{
		/** 페이지 이동
		 * 	_forms = formObject  
		 * 	_actionUrl =이동 URL
		 * */
		notFormSubmit : function(_actionUrl, _forms) {
			if(_forms == undefined){
				_forms = document.createElement('form');
				_forms.name = "tmpforms";
			}
			
			_forms.action = _actionUrl;
			_forms.method = "POST";
			document.body.appendChild(_forms);
			if( ibk.csw.common.getMewlAfcrCd() == "AT" ) {
				HanaPartner.showLoading('0', 'Y', function(){
					// 로딩을 보여준 이후 로직 구현
					setTimeout(function(){
						HanaPartner.hideLoading();
						_forms.submit();
					}, 500);
				});
			} else {
				_forms.submit();
			}
			
		},
		/**
		 * 웹뷰를 닫고 어플로 돌아간다.
		 */			
		backController : function() {
			
			try {
				
				if(oPLATFORM.ANDROID()) {
					if (window.closeWebViewJSInterface != null
							&& window.closeWebViewJSInterface != undefined) {
						window.closeWebViewJSInterface
								.closeWebView();
					}
				} else if(oPLATFORM.BADA()) {
					location.href = '__backController';
				} else if (oPLATFORM.BLACK_BERRY()) {
					//타임아웃 로그아웃
					//bbAlert('/timeOutExit');
					bbAlert('/backController');
				} else {
					//iPhone
					alert('/backController');
				}
					
			} catch(e) {
				HANA_LOG.error(e);
			}

		},		
		
		/**
		 * 서버 체크
		 */			
		serverChk : function(serverObj){
			var serverInfo;
			if(serverObj == 'dev'){
				serverInfo = 'dev11-';
			}else if (serverObj == 'stg'){
				serverInfo = 'stg11-';
			}else{
				serverInfo = '';
			}
			
			return serverInfo;
		},		
		
		/**
		 * 숫자만 입력
		 */		
		onlyNumber : function (obj){
			obj.val(obj.val().replace(/[^0-9]/gi, ''));
		},

		/**
		 * 숫자만 입력
		 */		
		onlyNum : function (obj){
			var tempNum = obj.value.trim();
			tempNum = tempNum.replace(/[^0-9]/g,'');
			obj.value = tempNum; 
		},		
		
		/**
		 * 숫자,영문 허용
		 */		
		onlyEngNum : function (obj){
			var tempNum = obj.value.trim();
			tempNum = tempNum.replace(/[^0-9a-zA-Z]/g,'');
			obj.value = tempNum; 
		},		
		
		/**
		 * 숫자,영문,특수문자 허용
		 */		
		engEtcNum : function (obj){
			obj.val(obj.val().replace(/[^0-9a-zA-Z.,()]/gi, ''));
		},

		/**
		 * 숫자,영문 허용
		 */		
		engNum : function (obj){
			obj.val(obj.val().replace(/[^0-9a-zA-Z]/gi, ''));
		},

		/**
		 * 숫자,영문,.-_ 허용
		 */		
		emailInput1 : function (obj){
			obj.val(obj.val().replace(/[^0-9a-zA-Z_\.-]/gi, ''));
		},
		/**
		 * 숫자,영문,. 허용
		 */		
		emailInput2 : function (obj){
			obj.val(obj.val().replace(/[^0-9a-zA-Z.]/gi, ''));
		},
		
		onlyNumberInput : function(e) {
			this.filterInputData('[0-9]', e);
		},
		
		/**
		 * 숫자,한글 허용
		 */		
		korNumEtc : function (obj){
			obj.val(obj.val().replace(/[^가-힣ㄱ-하-ㅣ0-9_(),.-\u318D\u119E\u11A2\u2022\u2025a\u00B7\uFE55\s]/gi, ''));
		},
		
		/**
		 * 입력받을 수 있는 값을 필터링한다. ex : <input type="text" .....
		 * onkeypress="filterKey('[0-9]', event)"> ; 숫자만 키입력이 가능한 text filed ex :
		 * <input type="text" ..... onkeypress="filterKey('[0-9a-zA-Z]',
		 * event)"> ; 영문,숫자만 키입력이 가능한 text filed
		 * 
		 * @param filter :
		 *            필터링할 정규표현식 ex) '[0-9]':0~9의 값만 허용, '[a-zA-Z]':알파벳만 허용
		 * @return
		 */
		filterInputData : function(filter, e) {
			if (filter) {
				var evt = e || window.event;
				var kCode = evt.which || evt.keyCode;
				// alert(kCode);
				/*
				 * backspace(8) ,tab(9),enter(13),shift(16),end(35),home(36),
				 * 방향키(좌(37),상(38), 하(40)),delete(46) 홈(36), 엔드(35), 페이지업(33),
				 * 페이지다운(34)
				 */
				var controlKeys = new Array(9, 13, 27, 37, 38, 40, 46, 36, 35,
						33, 34);

				//조작키이면 종료 
				for ( var i = 0; i < controlKeys.length; i++) {
					if (controlKeys[i] == kCode)
						evt.returnValue = false;
				}

				var sKey = String.fromCharCode(kCode);

				var re = new RegExp(filter);
				if (!re.test(sKey)) {
					if (kCode != "8") {
						evt.returnValue = false;
					}
				}
				var re = new RegExp('[ㄱ-ㅎ|ㅏ-ㅣ|가-힝]');
				if (re.test(sKey)) {
					evt.returnValue = false;
				}
			}
		},
		
		/**
		 * 특수문자
		 */
		isEtcChar : function (value) {
			return !new RegExp("[~!@#$%^&*()`_+|=\{}[\\]:;\"\'<>?,./]", "gi").test(value);
		},
		
		specialCharCheck : function(obj){
			var _checkCheckReslut = true;
			if($(obj).attr('data-spc-char') == undefined) return true; //input에  etc 속성값이 없으면 타지 않게 설계 테스트 완료후 삭제 예정
			var filterString = '';

			if($(obj).attr('data-spc-char') != undefined && $(obj).attr('data-spc-char') != ''){
				filterString = $(obj).attr('data-spc-char');
			}

			if(!ibk.csw.untact.common.filterIsEtcChar($(obj), filterString)){
				ibk.csw.common.openAlert({title:"알림", message:"특수문자를 입력하실수 없습니다."});
				return false;
				
			}	
			return _checkCheckReslut;
		},
		/**
		 * 특수문자 체크(해당문자 허용)
		 * @param obj
		 * @param inputFilterStr
		 * @returns boolean (포함 : true, 미포함 : false)
		 */
		filterIsEtcChar : function(obj, inputFilterStr){
			var filterStrings = "a-zA-Z0-9가-힝"; // 공통에서 사용할 특수문자 필터
			var filterStr = eval('/[^' + filterStrings + ']/');
			if(inputFilterStr != undefined && inputFilterStr != ''){
				inputFilterStr = ibk.csw.untact.common.replaceAll(inputFilterStr," ", "\\s");
				
				if(inputFilterStr.indexOf("[") > -1){
					inputFilterStr = inputFilterStr.replace("[", "\\[");
				}
				if(inputFilterStr.indexOf("]") > -1){
					inputFilterStr = inputFilterStr.replace("]", "\\]");
				}
				if(inputFilterStr.indexOf("{") > -1){
					inputFilterStr = inputFilterStr.replace("{", "\\{");
				}
				if(inputFilterStr.indexOf("}") > -1){
					inputFilterStr = inputFilterStr.replace("}", "\\}");
				}
				
				filterStr = eval('/[^' + filterStrings + inputFilterStr + ']/');
			}
			
			return !filterStr.test($(obj).val());
		},
		
		/**
		 * @param target
		 * @param str1
		 * @param str2
		 * @returns
		 */
		replaceAll : function(target, str1, str2) {
			var temp_str = "";
			
			// target 이 null 일경우 에러 발생함. target 이 존재할 경우만 실행함 2009.02.19 김상준.
			if (target && target != "" && str1 != str2) {
				temp_str = target;

				while (temp_str.indexOf(str1) > -1) {
					temp_str = temp_str.replace(str1, str2);
				}
			}
			return temp_str;
		},
		
		
		/**
		 * null 체크
		 */
		null2void : function(val){
			var data = val;
			if( data == undefined || data == "undefined" || data == null || data == "null" ){
				data = "";
			}
			return data;
		},
		
		isEmpty : function(val){
			if (typeof val == "undefined" || val == null) {
				return true;
			} else if (typeof val == "string" && val == "") {
				return true;
			} else {
				return false;
			}
		},
		
		/**
		 * 입력한 날짜를 비교를 비교하여 이후의 날짜인지 체크한다.
		 * firstDt가 secondDt보다 이후이면 true 반환
		 * @param firstDt: 비교할 날짜
		 * @param secondDt: 비교 대상 날짜
		 */
		checkAfterToday : function(date) {
			var sDay = parseInt(date,10);

			var today = msb.util.getDateObject();
			var todayStr = ibk.csw.untact.common.toDayString(today);
			
			var eDay = parseInt(todayStr,10);
			
			// 이후의 날짜인 경우
			if(sDay > eDay) {
				return true;
			}
			return false;
		},
		
		/**
		 * 날짜 객체를 문자형으로 반환
		 */
		toDayString : function(date) {
			var year = date.getFullYear();

			/* 1월=0,12월=11이므로 1 더함 */
			var month = date.getMonth() + 1;
			var day = date.getDate();
			var hour = date.getHours();
			var min = date.getMinutes();
			if (("" + month).length == 1) {
				month = "0" + month;
			}
			;
			if (("" + day).length == 1) {
				day = "0" + day;
			}
			;
			return ("" + year + month + day);
		},
		

		/**
		 * byte체크
		 */
		getByteLengthCheck : function(obj, maximum){
			
			var el = $(obj).val();

			var codeByte = 0;
			for(var idx = 0; idx < el.length; idx++){
				var oneChar = escape(el.charAt(idx));
				if(oneChar.length == 1){
					codeByte ++;
				}else if(oneChar.indexOf("%u") != -1){
					codeByte += 2;
				}else if(oneChar.indexOf("%") !=  1){
					codeByte ++;
				}
			}
			if(maximum < codeByte){
				return false;
			}
			return true;

		},
		
		/**
		 * byte로 문자열 자르기
		 */
		getByteLength : function(obj, maximum){
		    var inc = 0;
		    var nbytes = 0;
		    var message = $(obj).val();
		    var msg = "";
		    var msglen = message.length;

		    for (var i=0; i<msglen; i++) {
		        var ch = message.charAt(i);
		        if (escape(ch).length > 4) {
		            inc = 2;
		        } else if (ch == '\n') {
		            if (message.charAt(i-1) != '\r') {
		                inc = 1;
		            }
		        } else if (ch == '<' || ch == '>') {
		            inc = 4;
		        } else {
		            inc = 1;
		        }
		        if ((nbytes + inc) > maximum) {
		            break;
		        }
		        nbytes += inc;
		        msg += ch;
		    }
		    
		    return $(obj).val(msg);
		},
		
		/**
		 * 통합검색
		 */		
		addressSearchOepn : function(addressCallBack){
			$("#nextDiv").hide();
			$('#ulListResult li').remove();	
			if (addressCallBack != null && addressCallBack != undefined){
				_addressCallBack = addressCallBack
			}
			var url = "/untact/addressSearchUnfy01.do";	
//			$("#" + msb.HANA_SUB_CONTENT).hide();
//			$("#" + msb.HANA_CONTENT).show();
			var hanaJQuery = new HanaJQuery(msb.HANA_SUB_CONTENT, true);
			hanaJQuery.ajaxSubLoad(url, null, function() {
				msb.util.scrollTop(0);
			}, false);
		},
		
		handleEnterEventJusoSearch : function(e)
		{
			if (e.keyCode == 13) {
				event.stopPropagation();
				event.stopImmediatePropagation();
			}
//			if(e.keyCode == 13){
//				var filterString = '';
//				var obj = "#srchStrnCtt";
//				filterString = '(),- ';
//				if(!ibk.csw.untact.common.filterIsEtcChar($(obj), filterString)){
//					ibk.csw.common.openAlert({title:"알림", message:"특수문자를 입력하실수 없습니다."});
//					$(obj).focus();
//					return false;
//						
//				}
//				else
//				{
//					$("#confirmDiv").hide();
//					ibk.csw.untact.common.unfySearchList(document.forms['frmPostNoSearch']);
//				}
//			}
		},
		
		/**
		 * 주소검색
		 */
		unfySearchList : function(formObj, _requestPageNo){

			if(ibk.csw.untact.common.null2void(_requestPageNo) == ""){
				_requestPageNo = 1;
				$('#ulListResult li').remove();				
			}
			
			if(_requestPageNo > 1){
				if($("#srchStrnCttTmp").val().toUpperCase() != $("#srchStrnCtt").val().toUpperCase()){
					$("#srchStrnCtt").val($("#srchStrnCttTmp").val());
				}
			}
			
			if(ibk.csw.untact.common.null2void(formObj.srchStrnCtt.value) == ""){
				ibk.csw.common.openAlert({title:"알림", message:"검색어를 입력해 주세요."});
				return false;
			}
			
			$("#requestPageNo").val(_requestPageNo);
			
			$("#addressSelectDiv").hide();
			$("#confirmDiv").hide();
			$("#addressSearchResultDiv").show();
			$("#resultTxt").show();
			$("#searchResultTxt2").text("");

			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit('/untact/addressSearchUnfy02.do', formObj,function(res, arg) {
				if(arg == "success") {
					var data = jQuery.parseJSON(res.responseText);
					if(data.recNcnt > 0) {
						$('#searchResultTxt1').text("'"+$("#srchStrnCtt").val()+"' 검색결과");
						var strHtml = '';
						for(var i = 0 ; i < data.contMap['BIZ.PMH0138.OUT.REC'].length; i++ ) {
							var dataRec = data.contMap['BIZ.PMH0138.OUT.REC'][i];
							
							strHtml += '<li>';
							strHtml += '<input type="hidden" name="nwAdrZipNoList" value="'+dataRec.nwAdrZipNo+'"/>';
							strHtml += '<input type="hidden" name="roadNmAdrList" value="'+dataRec.roadNmAdr+'"/>';
							strHtml += '<input type="hidden" name="ldnoAdrList" value="'+dataRec.ldnoAdr+'"/>';
							strHtml += '<input type="hidden" name="nwAdrBldNmList" value="'+dataRec.nwAdrBldNm+'"/>';
							
							strHtml += '<p class="num">'+dataRec.nwAdrZipNo+'</p>';
							strHtml += '<a href="#none" onclick="ibk.csw.untact.common.selectAddress(this,1);"><span>[도로명]</span>'+dataRec.roadNmAdr+ " " + dataRec.nwAdrBldNm+'</a>';
							strHtml += '<a href="#none" onclick="ibk.csw.untact.common.selectAddress(this,2);"><span>[지번]</span>'+dataRec.ldnoAdr+" " + dataRec.nwAdrBldNm+'</a>';
							strHtml += '</li>';
						}// end for
						
						$("#ulListResult").append(strHtml);
						
						/*if(data.recCntnYn == "N"){
							$("#pagingDiv").hide();
						}else if(data.recCntnYn == "Y"){
							$("#pagingDiv").show();
							var requestPageTmp = Number($("#requestPageNo").val())+1;
							$("#srchStrnCttTmp").val(data.srchStrnCtt);
							$("#pagingDiv").find("a").attr("onclick", "javascript:ibk.csw.untact.common.unfySearchList(document.forms['frmPostNoSearch'], "+requestPageTmp+")");
						}*/
						
						// 더보기버튼 10번호출하면 다음거래여부(data.recCntnYn) N으로 내려옴.
						var totPageCnt = Math.ceil(data.totlNcnt/$("#pagePrProcNcnt").val());// 총건수/페이지건수 = 총페이지수
						if(totPageCnt > $("#requestPageNo").val()){
							var requestPageTmp = Number($("#requestPageNo").val())+1;
							$("#pagingDiv").show();
							$("#srchStrnCttTmp").val(data.srchStrnCtt);
							$("#pagingDiv").find("a").attr("onclick", "javascript:ibk.csw.untact.common.unfySearchList(document.forms['frmPostNoSearch'], "+requestPageTmp+")");
						}else{
							$("#pagingDiv").hide();
						}
					}else{
						$("#pagingDiv").hide();
						$('#ulListResult li').remove();
						$('#searchResultTxt1').text("검색결과가 없습니다.");
						$('#searchResultTxt2').text("검색어의 철자가 맞게 되어 있는지, 주소가 정확한지 다시 한번 확인하신 후 검색해주세요.");
					}
					
				}
			});
			
		},
		
		
		/**
		 * 기본주소확인,부속주소 입력
		 */
		selectAddress : function(obj, gubun) {
			msb.util.scrollTop(0);
			$("#resultTxt").hide();
			$("#addressSearchResultDiv").hide();
			$("#addressSelectDiv").show();
			$("#confirmDiv").show();
			$("#exAdrPop").focus();
			
			$("#zipNoPopTxt").text($(obj).parent().find("input[name=nwAdrZipNoList]").val());
			$("#baseAdrPopTxt").text($(obj).text());
			
			var nwAdrBldNmTmp = $(obj).parent().find("input[name=nwAdrBldNmList]").val();
			
			var baseAdrTmp = "";
			if(gubun == "1"){// 도로
				baseAdrTmp = $(obj).parent().find("input[name=roadNmAdrList]").val();
			}else{// 지번
				baseAdrTmp = $(obj).parent().find("input[name=ldnoAdrList]").val();
			}
			$("#selectGubun").val(gubun);
			$("#baseAdrPop").val(baseAdrTmp+" "+nwAdrBldNmTmp);
			
		},
		
		/**
		 * 주소정제
		 */
		addressSet : function() {

			if($('#exAdrPop').val().trim() == ""){//상세주소
				ibk.csw.common.openAlert({title:"알림", message:"상세 주소를 입력해 주세요."});
				return false;
			}else{
				var filterString = $("#exAdrPop").attr("data-spc-char");
				if(!ibk.csw.untact.common.filterIsEtcChar($("#exAdrPop"), filterString)){
					ibk.csw.common.openAlert({title:"알림", message:"특수문자를 입력하실수 없습니다."});
					return false;
				}
			}
			
			var gubun = $("#selectGubun").val();// 1:도로, 2:지번
			var adrTmp = $("#baseAdrPop").val();
			var formObj = msb.util.form.createForm([{id:"adrSrchDvCd",value:"1"},{id:"basZoneBaseAdr",value:adrTmp},{id:"basZoneExAdr",value:$("#exAdrPop").val()}]);
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit('/untact/addressSearchUnfy03.do', formObj,function(res, arg) {
				var dataRec = "";
				var adrAnalCd = "";// 1:지번, 2:도로명, 3:해석불가능
				var rfngYn = "";// 주소정제여부
				if(arg == "success") {
					var data = jQuery.parseJSON(res.responseText);
					adrAnalCd = data.adrAnalCd;
					rfngYn = data.rfngYn;
					
					
					for(var i = 0 ; i < data.contMap['BIZ.PMH0139.OUT.REC'].length; i++ ) {
						if(i==0){
							dataRec = data.contMap['BIZ.PMH0139.OUT.REC'][i];
						}
					}
					
					
					
					if (_addressCallBack != null && _addressCallBack != undefined){
						_addressCallBack(dataRec, adrAnalCd, rfngYn, gubun, $("#zipNoPopTxt").text());
						_addressCallBack = null;
					}
					toggleMainSubDiv();
				}
			});
		},
		
		
		/**
		 * 사업장주소
		 */
		setUntactAddress1 : function(data, adrAnalCd, rfngYn, gubun, zipNoTxt){
			if(rfngYn == "Y"){
				$("input[name=zipNo9]").val(data.zipNo);						// 우편번호
				$("input[name=nwAdrRoadNmCd9]").val(data.nwAdrRoadNmCd);		// 신주소도로명코드
				$("input[name=nwAdrEmdSeqNo9]").val(data.nwAdrEmdSeqNo);		// 신주소읍면동일련번호
				$("input[name=nwAdrUdgrYn9]").val(data.nwAdrUdgrYn);			// 신주소지하여부
				$("input[name=nwAdrManBldNo9]").val(data.nwAdrManBldNo);		// 신주소주건물번호
				$("input[name=nwAdrSbBldNo9]").val(data.nwAdrSbBldNo);			// 신주소부건물번호
				$("input[name=nwAdrBldMgntNo9]").val(data.nwAdrBldMgntNo);		// 신주소건물관리번호
				$("input[name=nwAdrMntnYn9]").val(data.nwAdrMntnYn);			// 신주소산여부
				$("input[name=nwAdrManLdno9]").val(data.nwAdrManLdno);			// 신주소주지번
				$("input[name=nwAdrSbLdno9]").val(data.nwAdrSbLdno);			// 신주소부지번
				$("input[name=stdngCd9]").val(data.stdngCd);					// 법정동코드
				$("input[name=adrRfngYn9]").val(rfngYn);						// 주소정제여부 
				$("input[name=basZoneNo9]").val(data.zipNo);					// 기초구역번호
				
				if(adrAnalCd == "1"){// 지번
					$("input[name=zipNoDvCd9]").val("4");					// 우편번호구분코드
					$("input[name=pmilSeqNo9]").val(data.pmilSeqNo);		// 우편일련번호
					$("input[name=pmilSeqNo92]").val(data.nwAdrPmilSeqNo);		// 신주소우편일련번호(nwAdrPmilSeqNo지번우편번호로 셋팅)
					$("input[name=zipNoAdr9]").val(data.custAdr);			// 우편번호주소
					$("input[name=exAdr9]").val(data.exAdr); 				// 자택부속주소 
					$("input[name=zipNoAdr92]").val(data.custAdr1);			// 고객주소1
					$("input[name=exAdr92]").val(data.exAdr1);				// 부속주소1
					$("input[name=basZoneBaseAdr91]").val(data.custAdr);	// 기초구역기본주소1
					$("input[name=basZoneExAdr91]").val(data.exAdr);		// 기초구역부속주소1
					$("input[name=basZoneBaseAdr92]").val(data.custAdr1);	// 기초구역기본주소2
					$("input[name=basZoneExAdr92]").val(data.exAdr1);		// 기초구역부속주소2
					$("input[name=basZoneEngAdr91]").val(data.engBaseAdr);			// 영문기본주소	
					$("input[name=basZoneEngAdr92]").val(data.engRoadNmBaseAdr);	// 영문도로명기본주소
					
					$('#wkplBaseAdrDiv').text("("+data.zipNo+") "+data.custAdr);
					$('#wkplExAdrDiv').text(data.exAdr);
					$('#wkplBaseAdrInput').val(data.custAdr);
					$('#wkplExAdrInput').val(data.exAdr);
					
				}else{// 도로명
					$("input[name=zipNoDvCd9]").val("3");					// 우편번호구분코드
					$("input[name=pmilSeqNo9]").val(data.nwAdrPmilSeqNo);	// 우편일련번호(pmilSeqNo도로명우편번호로 셋팅)
					$("input[name=pmilSeqNo92]").val(data.pmilSeqNo);	// 신주소우편일련번호
					$("input[name=zipNoAdr9]").val(data.custAdr1);  		// 자택 기본주소 	
					$("input[name=exAdr9]").val(data.exAdr1); 				// 자택부속주소 
					$("input[name=zipNoAdr92]").val(data.custAdr);			// 고객주소1
					$("input[name=exAdr92]").val(data.exAdr);				// 부속주소1
					$("input[name=basZoneBaseAdr91]").val(data.custAdr1);	// 기초구역기본주소1
					$("input[name=basZoneExAdr91]").val(data.exAdr1);		// 기초구역부속주소1
					$("input[name=basZoneBaseAdr92]").val(data.custAdr);	// 기초구역기본주소2
					$("input[name=basZoneExAdr92]").val(data.exAdr);		// 기초구역부속주소2
					$("input[name=basZoneEngAdr91]").val(data.engRoadNmBaseAdr);			// 영문기본주소	
					$("input[name=basZoneEngAdr92]").val(data.engBaseAdr);	// 영문도로명기본주소
					
					$('#wkplBaseAdrDiv').text("("+data.zipNo+") "+data.custAdr1);
					$('#wkplExAdrDiv').text(data.exAdr1);
					$('#wkplBaseAdrInput').val(data.custAdr1);
					$('#wkplExAdrInput').val(data.exAdr1);
				}
			}else{// 주소정제N일경우
				$("input[name=wkplAdrRfngYn]").val(rfngYn);
				if(gubun == "1"){// gubun-1:도로, 2:지번
					$("input[name=zipNo9]").val(zipNoTxt);// 우편번호
					$("input[name=zipNoAdr9]").val(data.custAdr1);  		// 자택 기본주소 	
					$("input[name=exAdr9]").val(data.exAdr1); 				// 자택부속주소
					$("input[name=stdngCd9]").val(data.stdngCd);			// 법정동코드
					$("input[name=basZoneEngAdr19]").val(data.engRoadNmBaseAdr);	// 영문기본주소
					$("input[name=zipNoDvCd9]").val("3");					// 우편번호구분코드
					
					$('#wkplBaseAdrDiv').text("("+zipNoTxt+")"+data.custAdr1);
					$('#wkplExAdrDiv').text(data.exAdr1);
					$('#wkplBaseAdrInput').val(data.custAdr1);
					$('#wkplExAdrInput').val(data.exAdr1);
					
				}else{// 지번
					$("input[name=zipNo9]").val(zipNoTxt);// 우편번호
					$("input[name=zipNoAdr9]").val(data.custAdr);  			// 자택 기본주소 	
					$("input[name=exAdr9]").val(data.exAdr); 				// 자택부속주소
					$("input[name=stdngCd9]").val(data.stdngCd);			// 법정동코드
					$("input[name=basZoneEngAdr91]").val(data.engBaseAdr);	// 영문기본주소
					$("input[name=zipNoDvCd9]").val("4");					// 우편번호구분코드
					
					$('#wkplBaseAdrDiv').text("("+zipNoTxt+") "+data.custAdr);
					$('#wkplExAdrDiv').text(data.exAdr);
					$('#wkplBaseAdrInput').val(data.custAdr);
					$('#wkplExAdrInput').val(data.exAdr);
				}
			}
			
			$("#adrUpdYn9").val("Y");
			$("#wkplBaseAdrDiv").parent().parent().parent().addClass("on");
			$("#wkplExAdrDiv").parent().addClass("on");
			
			ibk.csw.untact.untact300.requiredValueChk();
		},

		/**
		 * 본사주소
		 */
		setUntactAddress2 : function(data, adrAnalCd, rfngYn, gubun, zipNoTxt){
			if(rfngYn == "Y"){
				$("input[name=zipNo8]").val(data.zipNo);					// 우편번호
				$("input[name=nwAdrRoadNmCd8]").val(data.nwAdrRoadNmCd);	// 신주소도로명코드
				$("input[name=nwAdrEmdSeqNo8]").val(data.nwAdrEmdSeqNo);	// 신주소읍면동일련번호
				$("input[name=nwAdrUdgrYn8]").val(data.nwAdrUdgrYn);		// 신주소지하여부
				$("input[name=nwAdrManBldNo8]").val(data.nwAdrManBldNo);	// 신주소주건물번호
				$("input[name=nwAdrSbBldNo8]").val(data.nwAdrSbBldNo);		// 신주소부건물번호
				$("input[name=nwAdrBldMgntNo8]").val(data.nwAdrBldMgntNo);	// 신주소건물관리번호
				$("input[name=nwAdrMntnYn8]").val(data.nwAdrMntnYn);		// 신주소산여부
				$("input[name=nwAdrManLdno8]").val(data.nwAdrManLdno);		// 신주소주지번
				$("input[name=nwAdrSbLdno8]").val(data.nwAdrSbLdno);		// 신주소부지번
				$("input[name=stdngCd8]").val(data.stdngCd);				// 법정동코드
				$("input[name=adrRfngYn8]").val(rfngYn);					// 주소정제여부 
				$("input[name=basZoneNo8]").val(data.zipNo);				// 기초구역번호1
	
				if(adrAnalCd == "1"){// 지번
					$("input[name=zipNoDvCd8]").val("4");					// 우편번호구분코드
					$("input[name=pmilSeqNo8]").val(data.pmilSeqNo);		// 우편일련번호
					$("input[name=pmilSeqNo82]").val(data.nwAdrPmilSeqNo);		// 신주소우편일련번호
					$("input[name=zipNoAdr8]").val(data.custAdr);			// 우편번호주소
					$("input[name=exAdr8]").val(data.exAdr); 				// 자택부속주소 		
					$("input[name=zipNoAdr82]").val(data.custAdr1);			// 고객주소1
					$("input[name=exAdr82]").val(data.exAdr1);				// 부속주소1
					$("input[name=basZoneBaseAdr81]").val(data.custAdr);	// 기초구역기본주소1
					$("input[name=basZoneExAdr81]").val(data.exAdr);		// 기초구역부속주소1
					$("input[name=basZoneBaseAdr82]").val(data.custAdr1);	// 기초구역기본주소2
					$("input[name=basZoneExAdr82]").val(data.exAdr1);		// 기초구역부속주소2
					$("input[name=basZoneEngAdr81]").val(data.engBaseAdr);		// 영문기본주소	
					$("input[name=basZoneEngAdr82]").val(data.engRoadNmBaseAdr);// 영문도로명기본주소
					
					$('#baseAdrDiv').text("("+data.zipNo+") "+data.custAdr);
					$('#exAdrDiv').text(data.exAdr);
					$('#baseAdrInput').val(data.custAdr);
					$('#exAdrInput').val(data.exAdr);
				}else{// 도로
					$("input[name=zipNoDvCd8]").val("3");					// 우편번호구분코드
					$("input[name=pmilSeqNo8]").val(data.nwAdrPmilSeqNo);	// 우편일련번호
					$("input[name=pmilSeqNo82]").val(data.pmilSeqNo);	// 신주소우편일련번호
					$("input[name=zipNoAdr8]").val(data.custAdr1);			// 우편번호주소
					$("input[name=exAdr8]").val(data.exAdr1); 				// 자택부속주소 		
					$("input[name=zipNoAdr82]").val(data.custAdr);			// 고객주소1
					$("input[name=exAdr82]").val(data.exAdr);				// 부속주소1
					$("input[name=basZoneBaseAdr81]").val(data.custAdr1);	// 기초구역기본주소1
					$("input[name=basZoneExAdr81]").val(data.exAdr1);		// 기초구역부속주소1
					$("input[name=basZoneBaseAdr82]").val(data.custAdr);	// 기초구역기본주소2
					$("input[name=basZoneExAdr82]").val(data.exAdr);		// 기초구역부속주소2
					$("input[name=basZoneEngAdr81]").val(data.engRoadNmBaseAdr);		// 영문기본주소	
					$("input[name=basZoneEngAdr82]").val(data.engBaseAdr);// 영문기본주소
					$('#baseAdrDiv').text("("+data.zipNo+") "+data.custAdr1);
					$('#exAdrDiv').text(data.exAdr1);
					$('#baseAdrInput').val(data.custAdr1);
					$('#exAdrInput').val(data.exAdr1);
				}
			}else{// 주소정제N
				$("input[name=wkplAdrRfngYn]").val(rfngYn);
				if(gubun == "1"){// gubun-1:도로, 2:지번
					$("input[name=zipNo8]").val(zipNoTxt);// 우편번호
//					$("input[name=baseAdr]").val(data.custAdr1);  			// 자택 기본주소 	
					$("input[name=zipNoAdr8]").val(data.custAdr1);			// 우편번호주소
					$("input[name=exAdr8]").val(data.exAdr1); 				// 자택부속주소
					$("input[name=stdngCd8]").val(data.stdngCd);			// 법정동코드
					$("input[name=basZoneEngAdr81]").val(data.engRoadNmBaseAdr);	// 영문기본주소
					$("input[name=zipNoDvCd8]").val("3");					// 우편번호구분코드
					
					$('#baseAdrDiv').text("("+zipNoTxt+") "+data.custAdr1);
					$('#exAdrDiv').text(data.exAdr1);
					$('#baseAdrInput').val(data.custAdr1);
					$('#exAdrInput').val(data.exAdr1);
					
				}else{// 지번
					$("input[name=zipNo8]").val(zipNoTxt);// 우편번호
					$("input[name=zipNoAdr8]").val(data.custAdr);			// 우편번호주소
					$("input[name=exAdr8]").val(data.exAdr); 				// 자택부속주소
					$("input[name=stdngCd8]").val(data.stdngCd);			// 법정동코드
					$("input[name=basZoneEngAdr81]").val(data.engBaseAdr);	// 영문기본주소
					$("input[name=zipNoDvCd8]").val("4");					// 우편번호구분코드
					
					$('#baseAdrDiv').text("("+zipNoTxt+") "+data.custAdr);
					$('#exAdrDiv').text(data.exAdr);
					$('#baseAdrInput').val(data.custAdr);
					$('#exAdrInput').val(data.exAdr);
				}
			}
			
			$("#adrUpdYn8").val("Y");
			$("#baseAdrDiv").parent().parent().parent().addClass("on");
			$("#exAdrDiv").parent().addClass("on");
			ibk.csw.untact.untact300.requiredValueChk();
		},
		
		
		/**
		 * 자택주소
		 */
		setUntactAddress3 : function(data, adrAnalCd, rfngYn, gubun, zipNoTxt){
			if(rfngYn == "Y"){
				$("input[name=zipNo]").val(data.zipNo);					// 우편번호
				$("input[name=nwAdrRoadNmCd]").val(data.nwAdrRoadNmCd);	// 신주소도로명코드
				$("input[name=nwAdrEmdSeqNo]").val(data.nwAdrEmdSeqNo);	// 신주소읍면동일련번호
				$("input[name=nwAdrUdgrYn]").val(data.nwAdrUdgrYn);		// 신주소지하여부
				$("input[name=nwAdrManBldNo]").val(data.nwAdrManBldNo);	// 신주소주건물번호
				$("input[name=nwAdrSbBldNo]").val(data.nwAdrSbBldNo);		// 신주소부건물번호
				$("input[name=nwAdrBldMgntNo]").val(data.nwAdrBldMgntNo);	// 신주소건물관리번호
				$("input[name=nwAdrMntnYn]").val(data.nwAdrMntnYn);		// 신주소산여부
				$("input[name=nwAdrManLdno]").val(data.nwAdrManLdno);		// 신주소주지번
				$("input[name=nwAdrSbLdno]").val(data.nwAdrSbLdno);		// 신주소부지번
				$("input[name=stdngCd]").val(data.stdngCd);				// 법정동코드
				$("input[name=adrRfngYn]").val(rfngYn);					// 주소정제여부 
				$("input[name=basZoneNo]").val(data.zipNo);				// 기초구역번호1
				$("input[name=dwlShpCd]").val("99");					// 주거형태코드

				if(adrAnalCd == "1"){// 지번
					$("input[name=zipNoDvCd]").val("4");					// 우편번호구분코드
					$("input[name=pmilSeqNo]").val(data.pmilSeqNo);			// 우편일련번호
					$("input[name=pmilSeqNo2]").val(data.nwAdrPmilSeqNo);		// 신주소우편일련번호
					$("input[name=exAdr]").val(data.exAdr); 				// 자택부속주소 		
					$("input[name=zipNoAdr2]").val(data.custAdr1);			// 고객주소1
					$("input[name=exAdr2]").val(data.exAdr1);				// 부속주소1
					$("input[name=zipNoAdr]").val(data.custAdr);			// 우편번호주소
					$("input[name=basZoneBaseAdr1]").val(data.custAdr);		// 기초구역기본주소1
					$("input[name=basZoneExAdr1]").val(data.exAdr);			// 기초구역부속주소1
					$("input[name=basZoneBaseAdr2]").val(data.custAdr1);	// 기초구역기본주소2
					$("input[name=basZoneExAdr2]").val(data.exAdr1);		// 기초구역부속주소2
					$("input[name=basZoneEngAdr1]").val(data.engBaseAdr);	//영문도로명기본주소	
					$("input[name=basZoneEngAdr2]").val(data.engRoadNmBaseAdr);	//영문기본주소
					$('#baseAdrDiv').text("("+data.zipNo+")"+data.custAdr);
					$('#exAdrDiv').text(data.exAdr);
					$('#baseAdrInput').val(data.custAdr);
					$('#exAdrInput').val(data.exAdr);
				}else{// 도로
					$("input[name=zipNoDvCd]").val("3");					// 우편번호구분코드
					$("input[name=pmilSeqNo]").val(data.nwAdrPmilSeqNo);	// 우편일련번호
					$("input[name=pmilSeqNo2]").val(data.pmilSeqNo);	// 신주소우편일련번호
					$("input[name=exAdr]").val(data.exAdr1); 				// 자택부속주소 		
					$("input[name=zipNoAdr2]").val(data.custAdr);			// 고객주소1
					$("input[name=exAdr2]").val(data.exAdr);				// 부속주소1
					$("input[name=zipNoAdr]").val(data.custAdr1);			// 우편번호주소
					$("input[name=basZoneBaseAdr1]").val(data.custAdr1);	// 기초구역기본주소1
					$("input[name=basZoneExAdr1]").val(data.exAdr1);		// 기초구역부속주소1
					$("input[name=basZoneEngAdr1]").val(data.engRoadNmBaseAdr);	//영문도로명기본주소	
					$("input[name=basZoneEngAdr2]").val(data.engBaseAdr);	//영문기본주소
					
					$("input[name=basZoneBaseAdr2]").val(data.custAdr);	// 기초구역기본주소2
					$("input[name=basZoneExAdr2]").val(data.exAdr);		// 기초구역부속주소2
					
					$('#baseAdrDiv').text("("+data.zipNo+")"+data.custAdr1);
					$('#exAdrDiv').text(data.exAdr1);
					$('#baseAdrInput').val(data.custAdr1);
					$('#exAdrInput').val(data.exAdr1);
				}
			}else{// 주소정제N
				$("input[name=wkplAdrRfngYn]").val(rfngYn);
				$("input[name=dwlShpCd]").val("99");					// 주거형태코드
				if(gubun == "1"){// gubun-1:도로, 2:지번
					$("input[name=zipNo]").val(zipNoTxt);// 우편번호
					$("input[name=zipNoAdr]").val(data.custAdr1);			// 우편번호주소
					$("input[name=exAdr]").val(data.exAdr1); 				// 자택부속주소
					$("input[name=stdngCd]").val(data.stdngCd);			// 법정동코드
					$("input[name=basZoneEngAdr1]").val(data.engRoadNmBaseAdr);	// 영문기본주소
					$("input[name=zipNoDvCd]").val("3");					// 우편번호구분코드
					
					$('#baseAdrDiv').text("("+zipNoTxt+")"+data.custAdr1);
					$('#exAdrDiv').text(data.exAdr1);
					$('#baseAdrInput').val(data.custAdr1);
					$('#exAdrInput').val(data.exAdr1);
					
				}else{// 지번
					$("input[name=zipNo]").val(zipNoTxt);// 우편번호
					$("input[name=zipNoAdr]").val(data.custAdr);			// 우편번호주소
					$("input[name=exAdr]").val(data.exAdr); 				// 자택부속주소
					$("input[name=stdngCd]").val(data.stdngCd);			// 법정동코드
					$("input[name=basZoneEngAdr1]").val(data.engBaseAdr);	// 영문기본주소
					$("input[name=zipNoDvCd]").val("4");					// 우편번호구분코드
					
					$('#baseAdrDiv').text("("+zipNoTxt+")"+data.custAdr);
					$('#exAdrDiv').text(data.exAdr);
					$('#baseAdrInput').val(data.custAdr);
					$('#exAdrInput').val(data.exAdr);
				}
			}
			
			$("#baseAdrDiv").parent().parent().parent().addClass("on");
			$("#exAdrDiv").parent().addClass("on");
			ibk.csw.untact.untact310.requiredValueChk();
		},
		
		
		/**
		 * 영업점명으로 직원검색
		 */
		searchSugtEmpNoNm : function(){
			var url = "/untact/resultEmpNoNm.do";
			var brNo = '0591';    // 테스트용
			var oSendForm = msb.util.form.createForm([{id:"brNo",value:brNo},{id:"hanaFncHldgsGrcoCd",value:"01"},{id:"hdofcInqDvCd",value:"1"}]);
			
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit(url, oSendForm, function(res, arg) {
				var data = jQuery.parseJSON(res.responseText);
				
				console.log("직원수 ===== >>>   " + data.contMap['BIZ.PCM1291.OUT.REC'].length);
				
				$.each(data.contMap['BIZ.PCM1291.OUT.REC'], function(i, obj){
					console.log("직원명 > " + obj.empKornNm);
				});
				
			});
			
		},
		/**
		 * 백버튼
		 * */
		goBack : function(){
			ibk.csw.common.nftfFinishConfirm(
					'<s:property value="%{anonymSession.tempMap.untactInfo.nftfTrscChnlCd}"/>',
					'<s:property value="%{anonymSession.tempMap.untactInfo.nftfTrscKindDvCd}"/>');
		},
		dummy : null
		
	};//[end] return
	
}();
// back_btn

ibk.csw.untact.common.cert = function(){
	
	// 개발 품질 테스트용 사업자번호
	var bzRegNoArry = ['6918701674','8908801792','3038801793','4468801877','3068138233','7818101766','7128801814','7208701706','3728102033','8898701932','4768701624'];
	
	return {
		
		/*
		 * 인증센터 호출
		 * _resRegNo   : 사업자번호
		 * _prgrStFlag : 화면구분코드(Y:신청결과 조회)
		 */
		sendCorpSignData : function( _resRegNo, _prgrStFlag) {
			var passYn = true;
			for(var i=0; i < bzRegNoArry.length; i++){
				if(bzRegNoArry[i] == _resRegNo){
					passYn = false;
				}
			}
			
			// 개발, 품질 인증서 검증 패스 테스트용
			if((SERVER_SECTION == "dev" || SERVER_SECTION == "stg") && passYn){
				var url = '/untact/csuntact100.do?resRegNo='+_resRegNo+'&prgrStFlag='+_prgrStFlag;
				var formObj = document.forms['untactIdxForm'];
				msb.util.form.sendForm(formObj, url);
				
			}else{
				
				let csUrl = "/reform/certify/otherchannels/index.do"; // 기업 전자서명페이지
				let rtnUrl = "/untact/csuntact100.do";
				let bizGubn = "CPBCSW_0003"; // 업무구분(bizGubn)(bizcode + subbizcode + 인덱스번호 4자리)
				let jsonData;
				let jsonSignData;
				
				// jsonData 세팅
				jsonData = { resRegNo : _resRegNo,
						custNo : '',
						prgrStFlag : _prgrStFlag,
						scrapingOfclCertsSbmtYn : 'C' // 법인
				};
				jsonData = JSON.stringify(jsonData);
				jsonData = encodeURIComponent(jsonData);
				
				// jsonSignData 세팅
				jsonSignData = { checkMyCert : {value : 'Y', signId : '법인비대면인증서검증'}};
				jsonSignData = JSON.stringify(jsonSignData);
				jsonSignData = encodeURIComponent(jsonSignData);
				
				rtnUrl = ibk.csw.common.getDomainUrl() + rtnUrl;
				let url = "csUrl=" + csUrl + "&rtnUrl=" + rtnUrl + "&bizGubn=" + bizGubn + "&jsonData=" + jsonData + "&jsonSignData=" + jsonSignData;
				
				// 네이티브 호출
				location.href = "native://openWeb?" + url;
			}
		},
	
		dummy : null
	}
}();



//# sourceURL=ibk-csw-untact-common.js
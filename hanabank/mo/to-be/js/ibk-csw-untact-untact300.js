/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact300.js
 * 작성일 : 2021. 03. 31
 * 작성자 : 안영택
 * 설 명 : 기본정보(법인정보입력)
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact300 = function(){
	
	return{
		
		/**
		 * Object금액필드포멧
		 */
		toMoneyFormatting : function(obj){
			
			var objValue = parseInt(obj.value.replace(/\D/g,'')) + '';
			
			if (objValue != '0' && !isNaN(objValue)) {
				var re = /(-?\d+)(\d{3})/;
				while (re.test(objValue)) {
					objValue = objValue.replace(re, "$1,$2");
				}
			} else {
				objValue = '';
			}
			
			obj.value = objValue;
		},
		
		// 표준산업분류(업종) 찾기 Enter 처리
		handleEnterEventForStdIndsClasSearch : function(e){
//			if(jQuery("#sicSearchKeyword").val().length > 3){
			if(e.keyCode == 13){
				//msb.pbk.untact.untact510.doJusoSubmit(1);
				$('#sicSearchButton').click();
				$('#sicSearchButton').focus();
			}
		},
		
		// 표준산업분류(업종) 찾기
		seachStdIndsClas : function(){
			
			if(ibk.csw.untact.common.null2void($("#stdIndsClasNm").val()) == ""){
				hanaDialog.openAlert({title:"알림", message:"검색어를 입력해 주세요."});
				return false;
			}
			
			var formObj = msb.util.form.createForm([{id:"stdIndsClasNm",value:$("#stdIndsClasNm").val()}]);
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit("/untact/stdIndsClasSearch.do", formObj,
				function(httpRequest, textStatus){
					var data = jQuery.parseJSON(httpRequest.responseText);
					if (typeof data.recNcnt == "number" && data.recNcnt > 0) {
			        	//성공
						$('#sicSearchResultTxt').text("'"+$("#stdIndsClasNm").val()+"' 검색결과");
						ibk.csw.untact.untact300.drawStdIndsClasSearchedList(data);
			        } else {
			        	$('#sicSearchResultTxt').text('검색결과가 없습니다.');
			        	$('#stdIndsClasSearchedList li').remove();
			        }
				}
			);
			
		},
		

		// 표준산업분류(업종) 검색 목록 그리기
		drawStdIndsClasSearchedList : function(data){
			var contMap = data["contMap"];			
			var list = contMap["BIZ.CLN0063.OUT.REC"];
			
			$('#stdIndsClasSearchedList li').remove();
			
			$.each(list, function(idx, row){
								
				if(row["stdIndsClasDvCd"] == "5"){
					var resultData='<li onclick="ibk.csw.untact.untact300.selectStdIndsClas(\''+row["stdIndsClasCd"]+'\', \''+row["stdIndsClasNm"]+'\');">'
//									+'	<a href="#stdIndsClasNameDiv">'
									+'	<p class="num">'+row["stdIndsClasCd"]+'</p>'
									+'	<p class="service_name">'+row["stdIndsClasNm"]+'</p>'
//									+'	</a>'
									+'</li>';
					$('#stdIndsClasSearchedList').append(resultData);
				}				
				
			});
			layerScroll[scrollArr.indexOf("#layerpopupStdIndsClasCd")].update();
		},
		
		stdIndsClasLimit : function(code){
			
			if (code == "R91113" || code == "R91229" || code == "R91249" || code == "R91299" || code == "K64919" || code == "K64999" || code == "K66199" || code == "K66199"
				|| code == "K66199" || code == "C33110" || code == "G46492" || code == "G47830" || code == "G47912" || code == "G47911" || code == "J58222" || code == "G47311"
				|| code == "G47919" || code == "F42412" || code == "F42420" || code == "F42491" || code == "I56111" || code == "I56112" || code == "I56113" || code == "I56114"
				|| code == "I56121" || code == "I56122" || code == "I56123" || code == "I56129" || code == "I56191" || code == "I56192" || code == "I56193" || code == "L68111"
				|| code == "L68112" || code == "L68119" || code == "L68121" || code == "L68122" || code == "L68129" || code == "P85501" || code == "P85502" || code == "P85503"
				|| code == "P85621" || code == "P85622" || code == "P85629" || code == "P85631" || code == "P85632" || code == "P85661" || code == "Q86101" || code == "Q86102"
				|| code == "Q86103" || code == "Q86104" || code == "Q86105" || code == "Q86201" || code == "Q86202" || code == "Q86203" || code == "Q86204" || code == "Q86300"
				|| code == "Q86902" || code == "Q86909" || code == "C25200" || code == "K64209" || code == "K66122" || code == "K66192" || code == "K66202" || code == "M71101"
				|| code == "M71102" || code == "M71103" || code == "M71109" || code == "M71201" || code == "M71202" || code == "M71209" || code == "M71531" || code == "S94914"
				|| code == "S94920" || code == "S94931" || code == "S94939" || code == "S94990"){
				return false;
			}
			return true;
		},
		
		
		selectStdIndsClas : function(code, name){
			
			if(ibk.csw.untact.common.null2void(code) == "" || ibk.csw.untact.common.null2void(name) == ""){
				hanaDialog.openAlert({title:"알림", message:"표준산업분류 다시 검색해 주세요."});
				return false;
			}
			
			if(ibk.csw.untact.untact300.stdIndsClasLimit(code)){
				$("input[name=stdIndsClasCdInput]").val(code);
				$("#stdIndsClasNameDiv").html("("+code+") "+name);
				$("#stdIndsClasNameDiv").addClass('check_on');
				ibk.csw.untact.untact300.requiredValueChk();
				$(".j_layer_close").click();
			}else{
				hanaDialog.openAlert({title:"알림", message:"비대면 계좌개설이 불가한 업종입니다. 영업점에 방문하여 처리하시기 바랍니다."});
				return false;
			}
			
		},
		
		/**
		 * 이메일 주소 체크
		 */
		doCheckEmail : function(obj){
			var _emailVal = $(obj).val();
			/*
			 * 정규식 해석
			 * ^ 							=== 문자열 시작
			 * [_\-\.]? 					=== 첫 시작 문자(특수문자) _-. 0개 또는 1개
			 * [a-zA-Z0-9]{1} 				=== 영문소문자 또는 영문대문자 또는 숫자 1개
			 * ([_\-\.]?[a-zA-Z0-9])* 		=== (특수문자(_-.)가 있거나 없고, 영문소문자 또는 영문대문자 또는 숫자) 0개 이상
			 * @{1} 						=== @ 1개
			 * [a-zA-Z0-9_\-]+ 				=== (영문소문자 또는 영문대문자 또는 숫자 또는 _ 또는 -)가 1개 이상
			 * \.{1} 						=== . 1개
			 * [a-zA-Z0-9\.]* 				=== (영문소문자 또는 영문대문자 또는 숫자 또는 .)가 0개 이상
			 * [a-zA-Z0-9]+ 				=== (영문소문자 또는 영문대문자 또는 숫자)가 1개 이상
			 * $ 							=== 문자열 종료
			 */
			var regExp = /^[_\-\.]?[a-zA-Z0-9]{1}([_\-\.]?[a-zA-Z0-9])*@{1}[a-zA-Z0-9_\-]+\.{1}[a-zA-Z0-9\.]*[a-zA-Z0-9]+$/;
			var checkFlag = false;
			if(_emailVal.match(regExp) != null)
			{
				checkFlag = true;
			}
			else
			{
				checkFlag = false;
			}
			
			return checkFlag;
		},
		
		// 필수값 체크하여 다음버튼활성화
		requiredValueChk : function(){
			if($("#psnlBzRegNoInput").text().trim() != "" && $("#enprNmInput").val().trim() != "" && $("#wkplBaseAdrInput").val() != ""
			&& $("#wkplExAdrInput").val() != "" && $("#enplcTelNo1Input").val() !="" && $("#emalAdr2Input").val() !="" && $("#baseAdrInput").val() !=""
			&& $("#exAdrInput").val() !="" && $("#bizTelNoInput").val() !="" && $("#emalAdr1Input").val() !="" && $("#maigRcvplCdDiv").text().trim() !=""
			&& $("#telCtfcCdDiv").text().trim() !="" && $("#crpnRegNoInput").val() !="" && $("#crpnNmInput").val().trim() !="" && $("#stdIndsClasNameDiv").text().trim() !=""
			&& $("#corpScalCdDiv").text().trim() !="" && $("#corpRlseDvCdDiv").text().trim() !="" && $("#tpopNmInput").val() !="" && $("#primyTrtMitmNmInput").val() !=""
			&& $("#fndtDtInput").val() !="" && $("#esblhDtInput").val() !="" && $("#selKrwAmtInput").val() !=""
			){
				$("#nextDiv").show();
			}else{
				$("#nextDiv").hide();
			}
		},
		
		
		// 사업장명과 동일
		enplcNmIdentical : function(){
			if($("#enprNmInput").val().trim() != ""){
				$("#crpnNmInput").val($("#enprNmInput").val());//법인명
				$("#crpnNmInput").parent().parent().parent().addClass("on");
			}
		},
		
		
		// 사업자주소와 동일
		enplcIdentical : function(){

			if(ibk.csw.untact.common.null2void($("#wkplBaseAdrInput").val()) != "" && ibk.csw.untact.common.null2void($("#wkplExAdrInput").val()) != "" ){
				// 주소
				var adrTmp = $("#wkplBaseAdrInput").val();
				var formObj = msb.util.form.createForm([{id:"adrSrchDvCd",value:"1"},{id:"basZoneBaseAdr",value:adrTmp},{id:"basZoneExAdr",value:$("#wkplExAdrInput").val()}]);
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
						 var gubun = "";
						// 1:지번, 2:도로명
						 if($("#zipNoDvCd9").val() == "4"){
							 gubun = "1";
						 }else{
							 gubun = "2";
							 
						 }
						ibk.csw.untact.common.setUntactAddress2(dataRec, adrAnalCd, rfngYn, gubun, $("#zipNoDvCd9").val());
					}
				});
			} 
				
			
		},

		// 사업자 전화번호와 동일
		enplIdentTel : function(){
			if($("#enplcTelNo1Input").val().trim() != ""){
				$("#bizTelNoInput").val($("#enplcTelNo1Input").val());//전화번호
				$("#bizTelNoInput").parent().parent().parent().addClass("on");
			}
		},
		
		// 사업자이메일주소와 동일
		enplIdentEmal : function(){
			// 이메일
			if(ibk.csw.untact.common.null2void($("#enplcEmalInput1").val()) != ""){
				$("#emalInput1").val($("#enplcEmalInput1").val());
			}
			if(ibk.csw.untact.common.null2void($("#enplcEmalInput2").val()) != ""){
				$("#emalInput2").val($("#enplcEmalInput2").val());
				$("#emalAdr1DomainDiv").text($("#enplcEmalInput2").val());
				$("#emalAdr1Div").removeClass("j_focus");
				$("#emalInput3").val("");
				$("#emalAdr1Div").hide();
			}else{
				if($("#emalAdr2Div").css("display") != "none"){
					$("#emalAdr1DomainDiv").text("직접입력");
					$("#emalAdr1Div").show();
					$("#emalInput2").val("");
					$("#emalInput3").val($("#enplcEmalInput3").val());
				}
			}
			if(ibk.csw.untact.common.null2void($("#enplcEmalInput1").val()) != "" && (ibk.csw.untact.common.null2void($("#enplcEmalInput2").val()) != "" || ibk.csw.untact.common.null2void($("#enplcEmalInput3").val()) != "")){
				$("#emalAdr1Input").val($("#emalAdr2Input").val());//이메일
				$("#emalInput1").parent().parent().parent().addClass("on");
			}else{
				$("#emalAdr1Input").val("");
			}
		},
		
		
		telCheck : function(tel){
			var regTel = /(02.{0}|^01[016789]{1}|^070.{0}|^050.{1}|^0[3-9]{1}[0-9]{1})-[0-9]{3,4}-[0-9]{4}$/;
			if(!regTel.test(tel)){
				return false;
			}
			return true;
		},
		
		// 법인등록번호 포멧팅
		bizRegNoChange : function(obj){
			var bzRegNo = obj.value.trim();
			bzRegNo = bzRegNo.replace(/[^0-9]/g,'');
			obj.value = bzRegNo;
			if(bzRegNo.length > 7 || bzRegNo.length == 14){
				var team =  bzRegNo.substring(0, 6)+ "-" + bzRegNo.substring(6,13);
				obj.value = team;
			} 
		},
		
		requiredAlert : function(){
			var formObj = document.forms['untact300Form'];
			if($("#psnlBzRegNoInput").text().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"사업자등록번호는 필수 입력 입니다."});
				return false;
			}
			if($("#enprNmInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"사업자명(국문)은 필수 입력 입니다."});
				return false;
			}
			
			var korEtc = new RegExp('[ㄱ-ㅎ|ㅏ-ㅣ]');
			if (korEtc.test($("#enprNmInput").val())) {
				hanaDialog.openAlert({title:"알림", message:"사업자명(국문)을  확인해 주세요."});
				return false;
			}
			
			/*if($("#engNmInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"사업자명(영문)은 필수 입력 입니다."});
				return false;
			}
			if(!ibk.csw.untact.common.getByteLengthCheck($("#engNmInput"), 100)){
				hanaDialog.openAlert({title:"알림", message:"사업자명(영문)은 100byte를 초과할 수 없습니다."});
				return false;
			}*/
			if($("#wkplBaseAdrInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"사업자 주소는 필수 입력 입니다."});
				return false;
			}
			
			if($("#adrRfngYn9").val().trim() != "Y" || $("#basZoneNo9").val().length > 5){
				hanaDialog.openAlert({title:"알림", message:"사업자 주소를 다시 입력해 주세요."});
				return false;
			}
			
			if($("#enplcTelNo1Input").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"사업자 전화번호는 필수 입력 입니다."});
				return false;
			}
			if(!ibk.csw.untact.untact300.telCheck($("#enplcTelNo1Input").val())){
				hanaDialog.openAlert({title:"알림", message:"사업자 전화번호가 올바른 형식이 아닙니다."});
				return false;
			}
			if($("#enplcTelNo1Input").val().split("-")[1].charAt(0) == "0"){
				hanaDialog.openAlert({title:"알림", message:"올바른 사업자 전화번호를 입력 해주세요."});
				return false;
			}
			
			if($("#emalAdr2Input").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"사업자 이메일 주소는 필수 입력 입니다."});
				return false;
			}
			if(!ibk.csw.untact.common.getByteLengthCheck($("#emalAdr2Input"), 120)){
				hanaDialog.openAlert({title:"알림", message:"사업자 이메일 주소는 120byte를 초과할 수 없습니다."});
				return false;
			}
			if($("#baseAdrInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"본사 주소는 필수 입력 입니다."});
				return false;
			}
			if($("#adrRfngYn8").val().trim() != "Y" || $("#basZoneNo8").val().length > 5){
				hanaDialog.openAlert({title:"알림", message:"본사 주소를 다시 입력해 주세요."});
				return false;
			}
			
			if($("#bizTelNoInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"본사 전화번호는 필수 입력 입니다."});
				return false;
			}
			if(!ibk.csw.untact.untact300.telCheck($("#bizTelNoInput").val())){
				hanaDialog.openAlert({title:"알림", message:"본사 전화번호가 올바른 형식이 아닙니다."});
				return false;
			}
			if($("#bizTelNoInput").val().split("-")[1].charAt(0) == "0"){
				hanaDialog.openAlert({title:"알림", message:"올바른 본사 전화번호를 입력 해주세요."});
				return false;
			}
			if($("#emalAdr1Input").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"본사 이메일 주소는 필수 입력 입니다."});
				return false;
			}
			if(!ibk.csw.untact.common.getByteLengthCheck($("#emalAdr1Input"), 120)){
				hanaDialog.openAlert({title:"알림", message:"본사 이메일 주소는 120byte를 초과할 수 없습니다."});
				return false;
			}
			
			if($("#maigRcvplCdInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"우편물 수령처는 필수 입력 입니다."});
				return false;
			}
			if($("#telCtfcCdInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"전화연락처 선택은 필수 입력 입니다."});
				return false;
			}
			if($("#crpnRegNoInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"법인등록번호는 필수 입력 입니다."});
				return false;
			}
			if($("#crpnNmInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"법인명(국문)은 필수 입력 입니다."});
				return false;
			}
			if(!ibk.csw.untact.common.getByteLengthCheck($("#crpnNmInput"), 60)){
				hanaDialog.openAlert({title:"알림", message:"법인명(국문)은 60byte를 초과할 수 없습니다."});
				return false;
			}
			if (korEtc.test($("#crpnNmInput").val())) {
				hanaDialog.openAlert({title:"알림", message:"법인명(국문)을  확인해 주세요."});
				return false;
			}
			if($("#stdIndsClasCdInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"표준산업분류는 필수 입력 입니다."});
				return false;
			}
			
			if(!ibk.csw.untact.untact300.stdIndsClasLimit($("#stdIndsClasCdInput").val().trim())){
				hanaDialog.openAlert({title:"알림", message:"비대면 계좌개설이 불가한 업종입니다. 영업점에 방문하여 처리하시기 바랍니다."});
				return false;
			}
			
			
			if($("#corpScalCdInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"기업규모는 필수 입력 입니다."});
				return false;
			}
			if($("#corpScalCdInput").val() == "11"){
				hanaDialog.openAlert({title:"알림", message:"기업규모 대기업은 비대면 계좌개설이 불가합니다."});
				return false;
			}
			if($("#corpRlseDvCdInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"기업공개구분은 필수 입력 입니다."});
				return false;
			}
			if($("#tpopNmInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"업태는 필수 입력 입니다."});
				return false;
			}
			if(!ibk.csw.untact.common.getByteLengthCheck($("#tpopNmInput"), 40)){
				hanaDialog.openAlert({title:"알림", message:"업태는 40byte를 초과할 수 없습니다."});
				return false;
			}
			
			if($("#primyTrtMitmNmInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"주요최급품목은 필수 입력 입니다."});
				return false;
			}
			if(!ibk.csw.untact.common.getByteLengthCheck($("#primyTrtMitmNmInput"), 60)){
				hanaDialog.openAlert({title:"알림", message:"주요최급품목은 60byte를 초과할 수 없습니다."});
				return false;
			}
			
			if($("#fndtDtInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"개업일자는 필수 입력 입니다."});
				return false;
			}
			var fndtDate = ibk.csw.untact.common.replaceAll($("#fndtDtInput").val(),"-","");
			if(ibk.csw.untact.common.checkAfterToday(fndtDate)){
				hanaDialog.openAlert({title:"알림", message:'개업일자는 오늘 이후의 날짜는 입력하실 수 없습니다.'});
				return false;	
			}
			
			if($("#esblhDtInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"법인설립일자는 필수 입력 입니다."});
				return false;
			}
			var esblhDate = ibk.csw.untact.common.replaceAll($("#esblhDtInput").val(),"-","");
			if(ibk.csw.untact.common.checkAfterToday(esblhDate)){
				hanaDialog.openAlert({title:"알림", message:'법인설립일자는 오늘 이후의 날짜는 입력하실 수 없습니다.'});
				return false;	
			}
			
			if($("#selKrwAmtInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"매출금액은 필수 입력 입니다."});
				return false;
			}
			return true;
		},
		
		untact300Submit : function(formObj){
			
			if(!ibk.csw.untact.untact300.requiredAlert()) return false;
			
			// 사업장 이메일
			if(!ibk.csw.untact.untact300.doCheckEmail(document.getElementById('emalAdr2Input'))){	//이메일 형식 체크
				hanaDialog.openAlert({title:"알림", message:"사업자 이메일주소가 형식에 맞지 않습니다. 다시 입력해주세요.", fCallback1:function(){
					$('#emalAdr2Input').focus();
				}});
				return false;
			}

			// 본사이메일주소
			if(!ibk.csw.untact.untact300.doCheckEmail(document.getElementById('emalAdr1Input'))){	//이메일 형식 체크
				hanaDialog.openAlert({title:"알림", message:"본사 이메일주소가 형식에 맞지 않습니다. 다시 입력해주세요.", fCallback1:function(){
					$('#emalAdr1Input').focus();
				}});
				return false;
			}

			if($("#hmpeUrlAdrInput").val().trim().indexOf("://") > -1){
				var urlTmp = $("#hmpeUrlAdrInput").val().trim().substring(0,$("#hmpeUrlAdrInput").val().indexOf("://")+3);
				hanaDialog.openAlert({title:"알림", message:"홈페이지주소 "+urlTmp+" 제외하여 입력 하시기 바랍니다."});
				return false;
			}
			
			// 영문명 삭제또는 삭제 취소시 추가
			var engNmInput = "";
			if(!$(".j_delete").hasClass("j_delete")){
				engNmInput = $("#engNmInputDisabled").val();
			}
			msb.util.form.createHiddenField(formObj, 'engNmInput', engNmInput);
			
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit("/untact/csuntact301.do", formObj,
				function(httpRequest, textStatus){
					var data = jQuery.parseJSON(httpRequest.responseText);
					
					if(data.scssYn == "Y"){
							msb.util.form.sendForm(formObj, '/untact/csuntact310.do');
					}else{
						hanaDialog.openAlert({title:"알림", message:data.errCtt});
						return false;
					}
				}
			);
				
		},
		

		
		
		dummy : null
	};
	
}();

//# sourceURL=ibk-csw-untact-untact300.js
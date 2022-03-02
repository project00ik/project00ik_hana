/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact330.js
 * 작성일 : 2021. 04. 21
 * 작성자 : 안영택
 * 설 명 : 기본정보(실제소유자정보 입력)
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact330 = function(){
	
	return{
		
		onlyNumDot : function(e){
			e = e || window.event;
			var charCode = e.which || e.keyCode;
			if( !(charCode >= 48 && charCode <= 57) || charCode === 46 ){
				return false;
			}
				
		},
		
		/*
		 * 실제소유자확인생략코드 선택
		 * 0 : 해당사항없음 이외 거래 불가
		 */
		selCnfmOmisCd : function (value){
			$("#actlOwnrCnfmOmisCd").val(value);
			ibk.csw.untact.untact330.requiredValueChk();
			if("0" != value){
				hanaDialog.openAlert({title:"알림", message:'실제소유자확인생략법인에 해당 시 비대면 계좌개설이 불가합니다. 영업점에 내점하여 처리하시기 바랍니다.'});
				return false;
			}
		},
		
		/*
		 * 국적국가코드 선택
		 * 0 : 한국 이외 거래 불가
		 */
		selCntyCd : function (value){
			$("#ntltCntyCd").val(value);
			ibk.csw.untact.untact330.requiredValueChk();
			if("KR" != value){
				hanaDialog.openAlert({title:"알림", message:'한국 이외의 국적자는 비대면 계좌개설이 불가합니다. 영업점에 내점하여 처리하시기 바랍니다.'});
				return false;
			}
		},
		
		/*
		 * 국적국가코드 선택
		 * 1 : 25%이상 지분소유자만 거래 가능
		 */
		selActlOwnrRegDvCd : function(value){
			$("#actlOwnrRegDvCd").val(value);
			ibk.csw.untact.untact330.requiredValueChk();
			if("1" != value){
				hanaDialog.openAlert({title:"알림", message:'25%미만 최대지분소유자는 비대면 계좌개설이 불가합니다.<br/>영업점에 내점하여 처리하시기 바랍니다.'});
				return false;
			}
		},
		
		requiredValueChk : function(){
			if($("#actlOwnrCnfmOmisCd").val() != "" && $("#retrKornCustNm").val().trim() != "" && $("#btdy").val() != "" && $("#ntltCntyCd").val() != ""
				&& $("#actlOwnrRegDvCd").val() != "" && $("#shareRt").val() != ""){
				$("#nextDiv").show();
			}else{
				$("#nextDiv").hide();
			}
		},
		
		/**
		 * 한글 허용
		 */		
		onlyKor : function (obj){
			$(obj).val($(obj).val().replace(/[^ㄱ-힣\s]/gi, ''));
		},
		
		/*
		 * 실제소유자정보 등록
		 */
		submitUntact330 : function(formObj){
			
			
			// 실제소유자확인생략법인
			if("0" != $("#actlOwnrCnfmOmisCd").val()){
				hanaDialog.openAlert({title:"알림", message:'실제소유자확인생략법인에 해당 시 비대면 계좌개설이 불가합니다.<br/>영업점에 내점하여 처리하시기 바랍니다.', fCallback1:function(){
					ibk.csw.untact.untact330.requiredValueChk();
				}});
				return false;
			}
			
			// 실소유자명
			var korEtc = new RegExp('[ㄱ-ㅎ|ㅏ-ㅣ]');
			if (korEtc.test($("#retrKornCustNm").val())) {
				hanaDialog.openAlert({title:"알림", message:"실소유자명(국문)을  확인해 주세요."});
				return false;
			}
			
			// 생년월일
			var btdyInput = $("#btdyInput").val();
			if(btdyInput == "" || btdyInput == undefined){
				hanaDialog.openAlert({title:"알림", message:'생년월일을 선택해주세요.', fCallback1:function(){
					ibk.csw.untact.untact330.requiredValueChk();
				}});
				return false;
			}
			
			if(($("#retrKornCustNm").val() != $("#sessionCustNm").val()) || (ibk.csw.untact.common.replaceAll(btdyInput,"-","") != $("#sessionBtdy").val())){
				hanaDialog.openAlert({title:"알림", message:'대표자와 실소유자가 동일하지 않으면 비대면 계좌개설이 불가합니다.<br/>영업점에 방문하여 처리하시기 바랍니다.', fCallback1:function(){
					ibk.csw.untact.untact330.requiredValueChk();
				}});
				return false;
			}
			
			// 국적
			if("KR" != $("#ntltCntyCd").val()){
				hanaDialog.openAlert({title:"알림", message:'한국 이외의 국적자는 비대면 계좌개설이 불가합니다.<br/>영업점에 내점하여 처리하시기 바랍니다.', fCallback1:function(){
					ibk.csw.untact.untact330.requiredValueChk();
				}});
				return false;
			}
			
			// 등록구분
			if("1" != $("#actlOwnrRegDvCd").val()){
				hanaDialog.openAlert({title:"알림", message:'25%미만 최대지분소유자는 비대면 계좌개설이 불가합니다.<br/>영업점에 내점하여 처리하시기 바랍니다.', fCallback1:function(){
					ibk.csw.untact.untact330.requiredValueChk();
				}});
				return false;
			}
			
			// 지분율
			if(ibk.csw.untact.common.null2void($("#shareRt").val()) == ""){
				hanaDialog.openAlert({title:"알림", message:'지분율을 입력해 주세요.', fCallback1:function(){
					ibk.csw.untact.untact330.requiredValueChk();
				}});
				return false;
			}
			
			if(25 > $("#shareRt").val()){
				hanaDialog.openAlert({title:"알림", message:'지분율은 25%이상이어야 합니다.', fCallback1:function(){
					ibk.csw.untact.untact330.requiredValueChk();
				}});
				return false;
			}

			if($("#shareRt").val() > 100){
				hanaDialog.openAlert({title:"알림", message:'지분율은 100% 넘을 수 없습니다.', fCallback1:function(){
					ibk.csw.untact.untact330.requiredValueChk();
				}});
				return false;
			}
			
			if( $("#extgNewCustDvCd").val() == "1"){
				msb.util.form.sendForm(formObj, '/untact/csuntact340.do');
			}else{
				
				var hanaJQuery = new HanaJQuery(null, true);
				hanaJQuery.ajaxSubmit("/untact/csuntact331.do", formObj, function(httpRequest, textStatus) {
					var data = jQuery.parseJSON(httpRequest.responseText);
					if(data.scssYn == "Y"){
						msb.util.form.sendForm(formObj, '/untact/csuntact340.do');
					}else{
						hanaDialog.openAlert({title:"알림", message:data.errCtt});
						return false;
					}
					
				});
			}
			
		},
		
		dummy : null
	};
	
}();

//# sourceURL=ibk-csw-untact-untact330.js
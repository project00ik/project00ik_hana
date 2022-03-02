/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact420.js
 * 작성일 : 2021. 03. 23
 * 작성자 : 안영택
 * 설 명 : 상품신청(전자금융신청)
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact420 = function(){
	
	return{
		
		/**
		 * 숫자,영문 허용 
		 */		
		engNum : function (obj){
			$(obj).val($(obj).val().replace(/[^0-9a-zA-Z]/g, ''));
			
			if($(obj).val().length < 6){
				$("#userIdInputTxt").text("아이디는 6자리 이상 입력해 주세요.").parent().parent().addClass("error_on");
			}else{
				$("#userIdInputTxt").text("").parent().parent().removeClass("error_on");
				$("#userIdInputTxt2").text("").parent().parent().removeClass("non_error_on");
			}
			$("#userIdDupCh").val("N");
		},
		
		/**
		 * 이용자아이디 대문자로 변경 (샤오미,LG폰에서 onkeyup에 toUpperCase셋팅시 여러번 눌리는 현상 발생)
		 */
		idToUpperCase : function (obj){
			$(obj).val($(obj).val().toUpperCase());
		},
		
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
			if(obj.id == "dd1TrnsLimAmtInput"){// 1일이체한도 5억
				if(Number(ibk.csw.untact.common.replaceAll(objValue,",","")) > 500000000){
					$("#dd1TrnsLimAmtInput").parent().parent().parent().addClass("error_on");
				}else{
					$("#dd1TrnsLimAmtInput").parent().parent().parent().removeClass("error_on");
				}
			}else if(obj.id == "bot1TrnsLimAmtInput"){// 1회이체한도 1억
				if(Number(ibk.csw.untact.common.replaceAll(objValue,",","")) > 100000000){
					$("#bot1TrnsLimAmtInput").parent().parent().parent().addClass("error_on");
				}else{
					$("#bot1TrnsLimAmtInput").parent().parent().parent().removeClass("error_on");
				}
			}
			
		},
		
		// 최대한도
		setTrnsLimAmt : function(){
			if(!$(".btn_type06").hasClass("on")){
				$("#dd1TrnsLimAmtInput").val("500,000,000").parent().parent().parent().addClass("on");	// 1일이체한도(5억)
				$("#bot1TrnsLimAmtInput").val("100,000,000").parent().parent().parent().addClass("on");// 1회 이체한도(1억)
				$("#dd1TrnsLimAmtInput").parent().parent().parent().removeClass("error_on");
				$("#bot1TrnsLimAmtInput").parent().parent().parent().removeClass("error_on");
			}else{
				$("#dd1TrnsLimAmtInput").val("").parent().parent().parent().addClass("on");	// 1일이체한도(5억)
				$("#bot1TrnsLimAmtInput").val("").parent().parent().parent().addClass("on");// 1회 이체한도(1억)
				$("#dd1TrnsLimAmtInput").parent().parent().parent().removeClass("error_on");
				$("#bot1TrnsLimAmtInput").parent().parent().parent().removeClass("error_on");
			}
			ibk.csw.untact.untact420.requiredValueChk();
		},
		
		
		// 아이디 중복조회
		dupIdCheckFn : function(){
			var userIdInput = $("#userIdInput").val();
			if(ibk.csw.untact.common.null2void(userIdInput) == ""){
				$("#userIdInputTxt").text("아이디를 입력하세요.").parent().parent().addClass("error_on");
				return;
			}
			if($("#userIdInput").val().length < 6){
				$("#userIdInputTxt").text("아이디는 6자리 이상 입력해 주세요.").parent().parent().addClass("error_on");
				return;
			}
			
			var userId = $("#userIdInput").val();
			var chk_num = userId.search(/[0-9]/g);
			var chk_eng = userId.search(/[a-zA-Z]/ig);
			if(chk_eng < 0){
				$("#userIdInputTxt").text("아이디는 영문 또는 영문+숫자 6~15자리를 입력해 주세요.").parent().parent().addClass("error_on");
				return;
			}
			
			var formObj = msb.util.form.createForm();
			msb.util.form.createHiddenField(formObj, 'userId', userIdInput);
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit("/untact/csuntact421.do", formObj, function(res, arg) {
				var data = jQuery.parseJSON(res.responseText);
				if (data.dupYn == "Y") {
		            $("#userIdDupCh").val("N");
		            $("#userIdInputTxt").text("이미 사용중인 아이디입니다.").parent().parent().addClass("error_on");
		        } else {
		        	$("#userIdDupCh").val("Y");
		        	$("#userIdInputTxt").text("").parent().parent().removeClass("error_on");
		        	$("#userIdInputTxt2").text("사용 가능한 아이디 입니다.").parent().parent().addClass("non_error_on");
		        }
				ibk.csw.untact.untact420.requiredValueChk();
			});
				
		},
		
		// 선택한 출금계좌
		selAcctNoList : function(){
			
			if($("input[name=acctNoCheckbox]:checked").length == 0){
				
				hanaDialog.openAlert({title:"알림", message:"출금계좌는 최소 1개 이상 선택하셔야 합니다."});
				return false;
			}else{
				var acctNoStr = "";
				var acctNoCnt = 0;
				$("#selectedAccount").empty();
				$("input[name=acctNoCheckbox]:checked").each(function(idx, obj){
				   if(acctNoStr.length > 0) acctNoStr += ",";
				   acctNoStr += $(obj).attr("acctNo");
				   acctNoCnt++;
				   $("#selectedAccount").append('<li><p class="tit">'+$(obj).attr("acctNo").split("@")[1]+'</p><p class="num">'+msb.util.format.toAcctNo($(obj).attr("acctNo").split("@")[0])+'</p></li>');
				});
				
				$("#acctNoListInput").val(acctNoStr);
			}
		},
		
		// 보유중OTP선택
		selOtpVndrEntrCd : function(target) {
			if($('#otpVndrEntrCdPopUl li') != undefined && $('#otpVndrEntrCdPopUl li').length > 0){
				var arrVal = $(target).parent().attr("vndinfo").split('$');
				$('#otpSeqNo').val(arrVal[0]);
				$('#otpVndrEntrCd').val(arrVal[1]);
				$('#scrtMdclStCd').val(arrVal[2]);
				$('#otpUseRangDvCd').val(arrVal[3]);
				$('#issuDt').val(arrVal[4]);
				$('#gurTrmStrDt').val(arrVal[5]);
				$('#gurTrmEndDt').val(arrVal[6]);
				$('#scrtMdclIssuInstCd').val(arrVal[7]);
				if(arrVal[7] == '01005' || arrVal[7] == '01081'){	// 당행OTP
					$('#otpNewDvCdInput').val("3");	// OTP 재사용
				}else{	// 타행OTP
					$('#otpNewDvCdInput').val("2");
				}
				$('#usrMgntNo').val(arrVal[8]);
				$('#otpVndrEntrCdName').val(arrVal[9]);
				//$('#otpVndrEntrCdTxt').text($('#otpVndrEntrCdName').val() +" "+$('#otpSeqNo').val());
				$('#otpVndrEntrCdTxt').text($('#otpVndrEntrCdName').val());
			}else{
				hanaDialog.openAlert({title:"알림", message:"선택된 OTP가 없습니다."});
				return;
			}
		},
		
		// 초기화
		initOpt : function(){
			$('#otpSeqNo').val("");
			$('#otpVndrEntrCd').val("");
			$('#scrtMdclStCd').val("");
			$('#otpUseRangDvCd').val("");
			$('#issuDt').val("");
			$('#gurTrmStrDt').val("");
			$('#gurTrmEndDt').val("");
			$('#scrtMdclIssuInstCd').val("");
			$('#otpNewDvCdInput').val("");
			$('#usrMgntNo').val("");
			$('#otpVndrEntrCdName').val("");
		},
		
		// 모바일OTP 비밀번호 확인
		mOtpPwConfirmKeypadClose : function(){
			
			$('#checkItem').val('mOtpPw');
			
			//암호화 처리 시 반드시 호출
			mtk.fillEncData();

			if( ibk.csw.untact.common.null2void($('#mOtpPw').val()) == "" || ibk.csw.untact.common.null2void($('#mOtpPwConfirm').val()) == "") {
				$("#mOtpPwSuccessYn").val("N");
				return; // 비밀번호 확인 미입력시 검증안함 
			}
			
			if($('#mOtpPw').val().length != 6 || $('#mOtpPwConfirm').val().length != 6) {
				$("#mOtpPwSuccessYn").val("N");
				return;
			}
			
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit('/untact/csUntactPwCheck.do', document.forms["untact420Form"], function(httpRequest, textStatus){
				var data = jQuery.parseJSON(httpRequest.responseText);
				if(data.resultMap.result == 'error'){
		    		$('#mOtpPwConfirmErrorTxt').text(data.resultMap.errorMsg).parent().parent().addClass("error_on");
		    		$("#mOtpPwSuccessYn").val("N");
		    	}else{
		    		$("#mOtpPwSuccessYn").val("Y");
		    		$('#mOtpPwErrorTxt').text("").parent().parent().removeClass("error_on");
		    		$('#mOtpPwConfirmErrorTxt').text("").parent().parent().removeClass("error_on");
					setTimeout(function () {
						focusMove.init($('#mOtpPwConfirm'))	
					}, 100)
					bottomBtn.init();
		    	}
				ibk.csw.untact.untact420.requiredValueChk();
			});	
		},
		
		requiredValueChk : function(){
			if( ($("#userIdInput").val().trim() != "") 
				&& ($("input[name=dd1TrnsLimAmtInput]").val() != "" && Number(ibk.csw.common.replaceAll($("#dd1TrnsLimAmtInput").val(),",","")) <= 500000000) 
				&& ($("#bot1TrnsLimAmtInput").val() != "" && Number(ibk.csw.common.replaceAll($("#bot1TrnsLimAmtInput").val(),",","")) <= 100000000)
				&& ($("input[name=otpNewDvCdInput]").val() == "4" && $("#mOtpPwSuccessYn").val() == "Y" 
				|| $("input[name=otpNewDvCdInput]").val() == "2" 
				|| $("input[name=otpNewDvCdInput]").val() == "3" )
				&& ($("#acctNoDisplayYn").val() == "Y" && $("#wdrwNoAddYnInput").val() != "" || $("#acctNoDisplayYn").val() == "N" && $("#wdrwNoAddYnInput").val() == "")
			){
				$("#nextDiv").show();
			}else{
				$("#nextDiv").hide();
			}
		},
			
		
		requiredAlert : function(){
			
			if($("#userIdInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"이용자 아이디 필수 입력입니다."});
				return false;
			}
			if($("#userIdDupCh").val() != "Y"){
				hanaDialog.openAlert({title:"알림", message:"이용자 아이디 중복체크를 해주세요."});
				return false;
			}
			
			if($("#otpNewDvCdInput").val().trim() == "4"){
				if(ibk.csw.untact.common.null2void($('#mOtpPw').val()) == ""){
					hanaDialog.openAlert({title:"알림", message:"모바일OTP 활성화번호는 필수 입력 입니다."});
					return false;
				}
				if(ibk.csw.untact.common.null2void($('#mOtpPwConfirm').val()) == "") {
					hanaDialog.openAlert({title:"알림", message:"모바일OTP 활성화번호 확인은 필수 입력 입니다."});
					return false;				
				}
			}

			
			if($("#otpNewDvCdInput").val().trim() == "2" || $("#otpNewDvCdInput").val().trim() == "3"){
				if($("#selectedOtp").css("display") == "none"){
					hanaDialog.openAlert({title:"알림", message:"보유OTP를 선택해 주세요."});
					return false;
				}
				if(ibk.csw.untact.common.null2void($('#otpSeqNo').val()) == ""){
					hanaDialog.openAlert({title:"알림", message:"보유OTP를 선택해 주세요."});
					return false;
				}
			}
			
			if(Number(ibk.csw.common.replaceAll($("#dd1TrnsLimAmtInput").val(),",","")) > 500000000){
				hanaDialog.openAlert({title:"알림", message:"1일 이체한도는 5억원을 넘을 수 없습니다."});
				return false;
			}
			if(Number(ibk.csw.common.replaceAll($("#bot1TrnsLimAmtInput").val(),",","")) > 100000000){
				hanaDialog.openAlert({title:"알림", message:"1회 이체한도는 1억원을 넘을 수 없습니다."});
				return false;
			}
			if(Number(ibk.csw.common.replaceAll($("#bot1TrnsLimAmtInput").val(),",","")) > Number(ibk.csw.common.replaceAll($("#dd1TrnsLimAmtInput").val(),",",""))){
				hanaDialog.openAlert({title:"알림", message:"1회 이체한도는 1일 이체한도를 넘을 수 없습니다."});
				return false;
			}
			
			if($("#acctNoDisplayYn").val().trim() == "Y"){
				if(ibk.csw.untact.common.null2void($('#wdrwNoAddYnInput').val()) == ""){
					hanaDialog.openAlert({title:"알림", message:"출금계좌는 필수 입력 입니다."});
					return false;
				}
				if(ibk.csw.untact.common.null2void($('#wdrwNoAddYnInput').val()) == "Y" && ibk.csw.untact.common.null2void($("#acctNoListInput").val()) == ""){
					hanaDialog.openAlert({title:"알림", message:"출금계좌를 선택해 주세요."});
					return false;
				}
			}
			
			return true;
		},
		
		untact420Submit : function(formObj){
			
			if(!ibk.csw.untact.untact420.requiredAlert()) return;
			
			if($('input[name=otpNewDvCdInput]').val() == "4"){
				
				$('#checkItem').val('mOtpPw');
				//암호화 처리 시 반드시 호출
				mtk.fillEncData();
				
				var hanaJQuery = new HanaJQuery(null, true);
				hanaJQuery.ajaxSubmit('/untact/csUntactPwCheck.do', document.forms["untact420Form"], function(httpRequest, textStatus){
					var data = jQuery.parseJSON(httpRequest.responseText);
					if(data.resultMap.result == 'error'){
			    		hanaDialog.openAlert({title:"알림", message:data.resultMap.errorMsg});
						return false;	
			    	}else{
			    		ibk.csw.untact.untact420.doSubmit(formObj);
			    	}
					
				});	
			}else{
				ibk.csw.untact.untact420.doSubmit(formObj);
			}
		},
		
		doSubmit : function(formObj){
			
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit("/untact/csuntact422.do", formObj,
				function(httpRequest, textStatus){
					var data = jQuery.parseJSON(httpRequest.responseText);
					if(data.result == "success"){
						if($("#elecFncApcUpdYn").val() == "Y"){
							msb.util.form.sendForm(formObj, '/untact/csuntact440.do');
						}else{
							msb.util.form.sendForm(formObj, '/untact/csuntact430.do');
						}
					}else{
						hanaDialog.openAlert({title:"알림", message:"요청하신 서비스가 처리중 오류가 발생하였습니다."});
						return false;
					}
				}
			);
			
		},
		
		dummy : null
	};
	
}();

//# sourceURL=ibk-csw-untact-untact420.js
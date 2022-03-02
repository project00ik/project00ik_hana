/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact110.js
 * 작성일 : 2021. 03. 04
 * 작성자 : 김이준
 * 설 명 : 비대면 실명확인 - 자격검증 - 개인정보입력 (휴대폰인증)
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact110 = function(){
	
	return{
	
		/**
		 * 휴대폰번호 필드 클릭 시
		 */			
		onMbphEnprDvCdLabelClick : function (event) {
			if (!$('#mbphCnfmYn').is(':checked')) {
				event.preventDefault();
				event.stopPropagation();
				layerOpen.init('#layerpopupCertError');        				

			} else {
				$('#mbphEnprDvCdTxt').click();
			}
		},		
		
		/**
		 * 통신사 list item 선택 시 처리
		 */		
		onListItemClick : function (obj, targetInputName) {
			$('input[name='+targetInputName+']').val($(obj).attr('value'));
			$('input[name='+targetInputName+']').trigger('change');
		},
		
		/**
		 * 전화번호 입력/변경 시 처리
		 */
		chMbphOfcSeqNo : function(strEven) {
			var mbphOfcSeqNo = $("#mbphOfcSeqNo").val().replace(/\D/gi, '').substring(0, 11); // 11자 제한
			if (mbphOfcSeqNo.length > 9) {
				var mbphRcgnNo = mbphOfcSeqNo.substring(0, 3);
				var mbphOfcNo = mbphOfcSeqNo.substring(3, mbphOfcSeqNo.length-4);
				var mbphSeqNo = mbphOfcSeqNo.substring(mbphOfcSeqNo.length-4, mbphOfcSeqNo.length);
				$("#mbphOfcSeqNo").val(mbphRcgnNo+'-'+mbphOfcNo+'-'+mbphSeqNo);
				
			} else if (mbphOfcSeqNo.length > 6) {
				var mbphRcgnNo = mbphOfcSeqNo.substring(0, 3);
				var mbphOfcNo = mbphOfcSeqNo.substring(3, 6);
				var mbphSeqNo = mbphOfcSeqNo.substring(6, mbphOfcSeqNo.length);
				$("#mbphOfcSeqNo").val(mbphRcgnNo+'-'+mbphOfcNo+'-'+mbphSeqNo);
				
			} else if (mbphOfcSeqNo.length > 3) {
				var mbphRcgnNo = mbphOfcSeqNo.substring(0, 3);
				var mbphSeqNo = mbphOfcSeqNo.substring(3, mbphOfcSeqNo.length);
				$("#mbphOfcSeqNo").val(mbphRcgnNo+'-'+mbphSeqNo);
			} else {
				$("#mbphOfcSeqNo").val(mbphOfcSeqNo);
			}
			
			if(mbphOfcSeqNo.length > 9){
				$('#mbphOfcSeqNoDiv').removeClass("error_on");
				$('#mbphOfcSeqNoBtn').show();
			} else {
				$('#mbphOfcSeqNoBtn').hide();
			}
		},		
		
		/**
		 * 전화번호 포커스 아웃 시
		 */
		onFocusoutMbphOfcSeqNo : function() {
			var mbphOfcSeqNo = $("#mbphOfcSeqNo").val().replace(/\D/gi, '').substring(0, 11); // 11자 제한
			if(mbphOfcSeqNo.length > 9){
				$('#mbphOfcSeqNoDiv').removeClass("error_on");
				$('#mbphOfcSeqNoBtn').show();
			} else {
				$('#mbphOfcSeqNoDiv').addClass("on error_on");
				$("#mbphOfcSeqNoErrMsg").text("휴대폰 번호는 10자 또는 11자리의 숫자를 입력하시기 바랍니다.");
				$('#mbphOfcSeqNoBtn').hide();
			}
		},		
		
		/**
		 * 휴대폰 인증번호 요청
		 */
		goHpCertSMS : function(formObj, countDown, time) {
			
			// 휴대폰인증 이용약관 동의 체크여부 검증
			if(!$("#mbphCnfmYn").prop('checked')){
				hanaDialog.openAlert({title:"알림", message:'휴대폰인증 이용약관에 동의해 주셔야 진행이 가능합니다.'});
				return false;
			}
			
			if ($("#mbphEnprDvCd").val() == '') {
				hanaDialog.openAlert({title:"알림", message:'통신사를 선택해 주세요'});
				return false;
		    }
			
			if($("#mbphOfcSeqNo").val() == ''){
				hanaDialog.openAlert({title:"알림", message:'휴대폰 번호를 입력해 주세요'});
				return false;
			}

			var mbphOfcSeqNo = $("#mbphOfcSeqNo").val();
			if(mbphOfcSeqNo.replace(/-/gi, '').length < 10){
				hanaDialog.openAlert({title:"알림", message:'휴대폰번호는 국번을 포함하여 10자리 또는 11자리를 입력해 주세요'});
				return false;
			}
			
			var mbphNoArr = mbphOfcSeqNo.split('-');
			if(mbphNoArr.length > 1){
				$("#mbphRcgnNo").val(mbphNoArr[0]);
				$("#mbphOfcNo").val(mbphNoArr[1]);
				$("#mbphSeqNo").val(mbphNoArr[2]);
			}
			
			
		    countDown.initInterval();
			
		    ibk.csw.common.fnDeviceInterface('ibk.csw.untact.untact110.onAuthNumber', 'Device', 'getAuthNumber');
		    
		    var hanaJQuery = new HanaJQuery(null, true);
		    hanaJQuery.ajaxSubmit("/untact/csuntact111.do", formObj, function(httpRequest, textStatus){
	            
		    	var data = jQuery.parseJSON(httpRequest.responseText);
		    	
		    	if (data.RESULT == 'SUCCESS') { // 오류 검사
	            	$('#submitFormBtn').removeAttr('disabled');
	            	$('#mbphCertYn').val('Y');
	            	hanaDialog.openAlert({title:"알림", message:'인증번호가 발송되었습니다.', fCallback1:function(){	
	            		$("body").removeClass("body_fixed");
	            		$("html").css("overflow","");
	            		countDown.start(time);				    	
	            		//$('#nftfPhoneCertNumDiv').addClass('j_focus');
				    	$('#nftfPhoneCertNumTxt').val('');
				    	$('#nftfPhoneCertNumTxt').removeClass('check_on');
				    	
				    	$('#nftfPhoneCertNumTxt').addClass('j_input_value');
				    	$('input[name=nftfPhoneCertNum]').val('');
				    	focusMove.init($('#mbphOfcSeqNo'));
				       // msb.util.scrollTop($('#nftfPhoneCertNumTxt').offset(), false);	                	
	            	}});
	            } else {
	            	$('#mbphCertYn').val('N');
	            	hanaDialog.openAlert({
						title : "인증번호 요청",
						message : "인증번호 발송 중 오류가 발생하였습니다."
					});		            	
	            }
		    });
		},		
		
		/**
		 * Mobile app > webView 인터페이스
		 * 문자로 인증번호를 가져온다.
		 * 호출 getAuthNumber
		 * 콜백 onAuthNumber 
		 */
		onAuthNumber : function(data) {
			$("#nftfPhoneCertNumTxt").val(data.result);
			$("#nftfPhoneCertNumTxt").addClass('check_on')
			$("input[name=nftfPhoneCertNum]").val(data.result);
			bottomBtn.init()
		},		
		
		/**
		 * SMS인증 validate
		 */		
		validateUntact110 : function(formObj) {
			
			// 휴대폰인증 이용약관 동의 체크여부 검증
			if(!$("#mbphCnfmYn").prop('checked')){
				hanaDialog.openAlert({title:"알림", message:'휴대폰인증 이용약관에 동의해 주셔야 진행이 가능합니다.'});
				return false;
			}
			
			if ($("#mbphEnprDvCd").val() == '') {
				hanaDialog.openAlert({title:"알림", message:'통신사를 선택해 주세요'});
				return false;
		    }
			
			if($("#mbphOfcSeqNo").val() == ''){
				hanaDialog.openAlert({title:"알림", message:'휴대폰 번호를 입력해 주세요'});
				return false;
			}

			var mbphOfcSeqNo = $("#mbphOfcSeqNo").val();
			if(mbphOfcSeqNo.replace(/-/gi, '').length < 10){
				hanaDialog.openAlert({title:"알림", message:'휴대폰번호는 국번을 포함하여 10자리 또는 11자리를 입력해 주세요'});
				return false;
			}
			
			var mbphNoArr = mbphOfcSeqNo.split('-');
			if(mbphNoArr.length > 1){
				$("#mbphRcgnNo").val(mbphNoArr[0]);
				$("#mbphOfcNo").val(mbphNoArr[1]);
				$("#mbphSeqNo").val(mbphNoArr[2]);
			}
			
			if($("#mbphCertYn").val() != "Y") {
				hanaDialog.openAlert({title:"알림", message:'인증번호를 재요청해 주세요.'});
				return false;
			}
			
			if($("input[name=nftfPhoneCertNum]").val() == '') {
				$('#nftfPhoneCertNumDiv').addClass("error_on");
				hanaDialog.openAlert({title:"알림", message:'인증번호6자리를 입력해 주세요'});
				return false;
			}else if($("input[name=nftfPhoneCertNum]").val().length < 6) {
				$('#nftfPhoneCertNumDiv').addClass("error_on");
				hanaDialog.openAlert({title:"알림", message:'인증번호6자리를 입력해 주세요'});
				return false;
			}
			
			return true;
		},		
		
		/**
		 * SMS인증 확인
		 */			
		goSubmit : function(formObj) {
			
			if (!ibk.csw.untact.untact110.validateUntact110(formObj)) {
				
				return;
			}
			
			
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit("/untact/csuntact112.do", formObj, function(httpRequest, textStatus){
		    	
				var data = jQuery.parseJSON(httpRequest.responseText);
				
		    	if (data.RESULT == 'SUCCESS') { // 오류 검사
		    		/* NICE 검증 고객 CI 값 만 확인*/
		    		var prgrStFlag = $("#prgrStFlag").val();
		    		var rpYn = $("#rpYn").val();
		    		
					if("Y" == prgrStFlag){
						var url = "/untact/csuntact700.do"; 
						if(rpYn == "Y"){
							url = "/untact/csuntact800.do";
						}
						hanaDialog.openAlert({title:"알림", message:'본인인증이 완료되었습니다.', fCallback1:function(){
							ibk.csw.common.lodingProgress(500);
							ibk.csw.untact.common.notFormSubmit(url,formObj);
						}});
					}else{
						hanaDialog.openAlert({title:"알림", message:'본인인증이 완료되었습니다.', fCallback1:function(){
							ibk.csw.common.lodingProgress(500);
							ibk.csw.untact.common.notFormSubmit('/untact/csuntact115.do',formObj);
							//msb.util.form.sendForm(formObj, '/untact/csuntact115.do');
						}});
					}
		    		
		    		
	            } else {
	            	$('#mbphCertYn').val('N');
	            	hanaDialog.openAlert({
						title : "인증번호 확인",
						message : "본인인증에 실패하였습니다."
					});		            		            	
	            }
				
			});			

		},		
		
	};
	
}();

//# sourceURL=ibk-csw-untact-untact110.js
/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact531.js
 * 작성일 : 2021. 03. 22
 * 작성자 : 임재학
 * 설 명 : 추가인증 - 타행 본인계좌 확인
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact531 = function(){
	
	return{
		
		/**
		 * 예금주 확인
		 */
		acctNoCheck : function(formObj){
			
			// validation
			if($("#rmrkCertAcctNo").val() != undefined && $("#rmrkCertAcctNo").val() != ''){
				if($("#rmrkCertAcctBnkCd").val() == $("#rcvBnkCd").val()
						&& $("#rmrkCertAcctNo").val() == $("#rcvAcctNo").val()){
					hanaDialog.openAlert({title:"알림", message:'인증번호를 다시 받으시려면 다른 은행 계좌를 입력해 주세요'});
					return;
				}
			}
			//금융기관 누락
			if($('#rcvBnkCd').val() == undefined || $('#rcvBnkCd').val() == '') {
				hanaDialog.openAlert({title:"알림", message:'금융기관을 선택해 주세요'});
				return;
			}
			
			//계좌번호 누락
			if($('#rcvAcctNo').val() == undefined || $('#rcvAcctNo').val() == '') {
				hanaDialog.openAlert({title:"알림", message:'계좌번호를 입력해 주세요', fCallback1:function(){	
					$("#rcvAcctNo").focus();
				}});
				return;
			}
			
			// 값 초기화
			$("#rmrkCertAcctBnkCd").val("");
			$("#rmrkCertAcctNo").val("");
			
			var hanaJQuery = new HanaJQuery(msb.HANA_CONTENT, true, null);
			hanaJQuery.ajaxSubmit("/untact/csuntact532.do", formObj, function(httpRequest, textStatus) {
				var oJsonData = jQuery.parseJSON(httpRequest.responseText);
				
				if(oJsonData.result == 'success'){
					$("#rmrkCertAcctBnkCd").val($("#rcvBnkCd").val());
					$("#rmrkCertAcctNo").val($("#rcvAcctNo").val());
					$(".btn_type02").html("재요청");
					$(".won_btn").attr("disabled",false);
				}else{
					$(".btn_type02").html("타행계좌인증");
					$(".won_btn").attr("disabled",true);
					hanaDialog.openAlert({title:"알림", message: oJsonData.errorMsg});
					return;
				}
			});
		},
		
		/**
		 * 1원 인증 요청
		 */
		wonTransfer : function(formObj) {
			
			// 예금주 확인을 하지 않았을 경우
			if($('#rmrkCertAcctNo').val() == undefined || $('#rmrkCertAcctNo').val() == '') {
				hanaDialog.openAlert({title:"알림", message:'예금주 확인을 먼저 진행해 주세요.'});
				return;
			}
			
			// 예금주 확인후 계좌 변경 했을경우
			if($('#rmrkCertAcctNo').val() != $("#rcvAcctNo").val()){
				hanaDialog.openAlert({title:"알림", message:'예금주 확인을 먼저 진행해 주세요.'});
				return;
			}
			
			var hanaJQuery = new HanaJQuery(msb.HANA_CONTENT, true, null);
			hanaJQuery.ajaxSubmit("/untact/csuntact533.do", formObj, function(httpRequest, textStatus) {
				
				var oJsonData = jQuery.parseJSON(httpRequest.responseText);
				
				if(oJsonData.result == 'success'){
					$("#wonTransferCh").val("Y");
					$("#rmrkCertNoCh").val('N'); //인증번호 검증여부
					$('.j_focus_move').click();
					
				}
			});
		},
		
		/**
		 * 1원 인증 확인
		 */
		rmrkCertNoCh: function(frmObj) { 
			if($("#wonTransferCh").val() != 'Y'){
				hanaDialog.openAlert({title:"알림", message:"새로운 인증번호를 요청하여 신청해주세요"});
				return;
			}
			
			if($("#rmrkCertNo").val() == undefined || $("#rmrkCertNo").val() == '' || $("#rmrkCertNo").val().length < 3){
				hanaDialog.openAlert({title:"알림", message:"인증번호 3자리를 입력해주세요"});
				return;
			}
			
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit("/untact/csuntact534.do", frmObj, function(httpRequest, textStatus) {
				
				try {
					var oJsonData = jQuery.parseJSON(httpRequest.responseText);
					if(oJsonData.result == 'success'){
						$("#rmrkCertNoCh").val("Y");
						hanaDialog.openAlert({title:"알림", message:"인증번호 확인이 완료되었습니다.", 
							fCallback1:function(){
								// 페이지 이동
								msb.util.form.sendForm(frmObj, '/untact/csuntact600.do');
							}
						});
					}else{
						
						if(oJsonData.errorCd == '01'){
							hanaDialog.openAlert({title:"알림", message:oJsonData.errorMsg, 
								fCallback1:function(){
									// 계좌인증, 1원 이체 완료여부 초기화
									$("#rmrkCertAcctBnkCd").val("");
									$("#rmrkCertAcctNo").val("");
									$("#wonTransferCh").val("N");
									$("#rmrkCertNoCh").val('N');
									// 계좌인증으로 이동
									window.scrollTo({top:0});
									$('body').css('min-height',0);
									$('body').find('.j_1won-certy').hide();
									$('body').find('.j_btn_fix').hide();
								}
							});
						}else if(oJsonData.errorCd == '02'){
							hanaDialog.openAlert({title:"알림", message:oJsonData.errorMsg});
							$("#rmrkCertNoCh").val("N");
						}else{
							hanaDialog.openAlert({title:"알림", message:oJsonData.errorMsg});
							$("#rmrkCertNoCh").val("N");
						}
						
					}
				} catch(e) {
					hanaDialog.openAlert({title:"알림", message:e.message});
					$("#rmrkCertNoCh").val("N");
				}
			});
		},
		
		/**
		 * 금융기관 선택
		 */
		selRcvBnkCd : function(codeVal){
			if(codeVal != $("#rcvBnkCd").val()){
				$("#wonTransferCh").val('N'); //이체 유무
				//금융기관 선택 시 버튼 재 활성화
			}
			$("#rcvBnkCd").val(codeVal);
		},
		
		/**
		 * 계좌번호 onfocus
		 */
		chkRcvBnkCd : function(){
			if($("#rcvBnkCd").val() == ''){
				hanaDialog.openAlert({title:"알림", message:"금융기관을 먼저 선택해 주세요.", 
					fCallback1:function(){
						$("#rcvBnkTxt").click();
					}
				});
				return;
			}
		},
		
		/**
		 * 계좌 검증 데이터를 다시 입력 했을 때
		 */
		rcvAcctNoUpdate : function() {
			if( $("#rcvAcctNo").val() != $("#rmrkCertAcctNo").val()){
				//$("#step2Btn").show(); //계좌 검증 데이터를 다시 재 입력 시 버튼 활성화
				$("#wonTransferCh").val('N'); //이체 유무
			}
		},
		
		/**
		 * 계좌번호 입력 이벤트
		 */
		rcvAcctNoInputChk : function() {
			$("#rcvAcctNo").val($("#rcvAcctNo").val().replace(/\D/gi, ''));
		},
		
		rmrkCertNoCheck : function(){
			var rmrkCertNo = $('#rmrkCertNo').val();
			if(rmrkCertNo.length == 3){
				$('.j_btn_fix').show();
			}else{
				$('.j_btn_fix').hide();
			}
		},
		
		dummy : null
	};
	
}();

//# sourceURL=ibk-csw-untact-untact531.js
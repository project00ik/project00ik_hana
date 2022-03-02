/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact200.js
 * 작성일 : 2021. 04. 19
 * 작성자 : 신성환
 * 설 명 : 동의 및 상품설명서 확인
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact200 = function(){
	
	var elecOnlyYn = "N"; // 기업전자금융만 신청했는지 여부
	
	return{
		
		/**
		 * 상품설명서 확인함 버튼 클릭    
		 */
		prdDescCnfm : function(){		
			if($('#button01').hasClass('on')){
				$('#button01').removeClass('on');
			}else{
				$('#button01').addClass('on');	
			}
		},
		
		/**
		 * 필수 동의 및 확인 - 동의    
		 */
		agreeCallback1 : function() {
			layerOpen.init('#layerpopup02');		
			$('#ul01').show();
			$('#depth01-1').prop('checked', true);
			$('.depth02_1').prop('checked', true);
			$('#button01')[0].scrollIntoView();
		},		
		
		/**
		 * 약관 및 상품설명서 확인 - 동의    
		 */		
		agreeCallback2 : function() {
			$('#ul02').show();
			$('#depth01-3').prop('checked', true);
			$('.depth02_3').prop('checked', true);
			
			if(ibk.csw.untact.untact200.elecOnlyYn == "Y"){			
				if($('#depth01-3').prop('checked')){
					$('#allcheck').prop('checked', true);
					$('.j_btn_fix').show();
				}else{
					$('#allcheck').prop('checked', false);
					$('.j_btn_fix').hide();
				}				
			}else{
				if($('#depth01-1').prop('checked') && $('#depth01-3').prop('checked')){
					$('#allcheck').prop('checked', true);
					$('.j_btn_fix').show();
				}else{
					$('#allcheck').prop('checked', false);
					$('.j_btn_fix').hide();
				}			
			}
			$('#button01')[0].scrollIntoView();
		},		
		
		/**
		 * 동의사항, 약관 - 취소    
		 */			
		cancleCallback : function (arg) {
//			if(arg == 1){
//				$('#depth01-1').prop('checked', false);
//				$('.depth02_1').prop('checked', false);
//			}else{
//				$('#depth01-3').prop('checked', false);
//				$('.depth02_3').prop('checked', false);
//			}
//			$('#allcheck').prop('checked', false);
//			$('.j_btn_fix').hide();
		},		
		
		/**
		 * 체크박스 클릭    
		 */		
		checkClick: function(arg) {
			// 모두 동의
			if(arg == 1){
				if($('#allcheck').prop('checked')){
					$('.depth02_1').prop('checked', false);
					$('.depth02_3').prop('checked', false);
					$('#button01').removeClass('on');
					$('#button01')[0].scrollIntoView();
					$('.j_btn_fix').hide();				
				}
			// 필수 동의 및 확인
			}else if(arg == 2){
				if($('#depth01-1').prop('checked')){
					$('.depth02_1').prop('checked', false);
					$('#allcheck').prop('checked', false);
					$('.j_btn_fix').hide();				
				}			
			// 약관 및 상품설명서 확인
			}else if(arg == 3){
				if($('#depth01-3').prop('checked')){
					$('.depth02_3').prop('checked', false);
					$('#allcheck').prop('checked', false);
					$('.j_btn_fix').hide();			
				}			
			}
		},		

		/**
		 * 법인사업자정보 입력 화면이동    
		 */			
		goCpuntact300 : function(formObj) {
			
			if(!$('#button01').hasClass('on')){
				layerOpen.init('#layerpopup04');
				return false;
			}
			
			// 신규 고객일 경우 KIS-DATA를 활용 여부 팝업 호출
			if($('#extgNewCustDvCd').val() == "2"){
				layerOpen.init('#layerpopup05');		
			}else{
				// 약관동의 서비스 실행 
				var hanaJQuery = new HanaJQuery(msb.HANA_CONTENT, true, null);
				hanaJQuery.ajaxSubmit("/untact/csuntact201.do", formObj, function(httpRequest, textStatus) {
					
					try{
						
						var data = jQuery.parseJSON(httpRequest.responseText);
						
						// 법인정보입력 화면이동
						msb.util.form.sendForm(formObj, '/untact/csuntact300.do');

					} catch(e) {
						hanaDialog.openAlert({title:"알림", message:"[" + e.code + "] " + e.message});
			        }							
						
				});				
			}			
			 
		},		
			
		nextBtnClickEvent : function(arg) {
			
			if(arg == "2"){
				$("#niceYn").val("Y");
			}else{
				$("#niceYn").val("N");
			}			

			// 약관동의 서비스 실행 
			var hanaJQuery = new HanaJQuery(msb.HANA_CONTENT, true, null);
			hanaJQuery.ajaxSubmit("/untact/csuntact201.do", document.forms["untact200Form"], function(httpRequest, textStatus) {
				
				try{
					
					var data = jQuery.parseJSON(httpRequest.responseText);
					
					// 법인정보입력 화면이동
					msb.util.form.sendForm(document.forms["untact200Form"], '/untact/csuntact300.do');

				} catch(e) {
					hanaDialog.openAlert({title:"알림", message:"[" + e.code + "] " + e.message});
		        }							
					
			});			
			
		},		
		
		dummy : null
	};
	
}();

//# sourceURL=ibk-csw-untact-untact200.js
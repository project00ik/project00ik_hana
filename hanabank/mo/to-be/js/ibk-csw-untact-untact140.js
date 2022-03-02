/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact140.js
 * 작성일 : 2021. 03. 18
 * 작성자 : 신성환
 * 설 명 : 상품선택
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact140 = function(){
	
	return{
		
		/**
		 * 상품가입 검증   
		 */		
		ntryChk : function(formObj){
			
			$('.list_num').empty();
			var errorYn = "N";
			
			$('#dpPrdApcYn').val('');		// 예금상품신청여부
			$('#frcDpPrdApcYn').val('');	// 외화예금상품신청여부
			$('#elecFncApcYn').val('');		// 전자금융신청여부
			
			$('.check_list li.on a strong').each(function(e){
				
				var _this = $(this);
				
				if(_this.text() != "모두 선택"){
					
					if(_this.text() == "기업자유예금"){
						
						if($('#statusDpPrdApcYn').val() == "Y"){
							hanaDialog.openAlert({title:"알림", message:"가입 진행중인 기업자유예금이 있습니다."});
							errorYn = "Y";
							return false;						
						}
						
						$('#dpPrdApcYn').val('Y');
					}
					
					if(_this.text() == "외화다통화예금"){
						
						if($('#extgNewCustDvCd').val() == "1"){
							if($('#trstListSize').val() == 0){
								if($('#dpPrdApcYn').val() == "N"){	
									hanaDialog.openAlert({title:"알림", message:"요구불계좌 없으면 외화다통화예금 개설불가."});
									errorYn = "Y";
									return false;					
								}
							}						
						}
						
						if($('#statusFrcDpPrdApcYn').val() == "Y"){
							hanaDialog.openAlert({title:"알림", message:"가입 진행중인 외화다통화예금이 있습니다."});
							errorYn = "Y";
							return false;						
						}					
						
						$('#frcDpPrdApcYn').val('Y');
					}
					
					if(_this.text() == "기업전자금융"){
						
						if($('#extgNewCustDvCd').val() == "1"){
							if($('#trstListSize').val() == 0){
								if($('#dpPrdApcYn').val() == "N"){
									hanaDialog.openAlert({title:"알림", message:"요구불계좌 없으면 전자금융 가입불가."});
									errorYn = "Y";
									return false;					
								}
							}					
						}
						
						if($('#statusElecFncApcYn').val() == "Y"){
							hanaDialog.openAlert({title:"알림", message:"가입 진행중인 기업전자금융이 있습니다."});
							errorYn = "Y";
							return false;						
						}					
						
						$('#elecFncApcYn').val('Y');
					}			
					
					$('.list_num').append("<li>"+_this.text()+"</li>");					
				}
				
				
			})		
			
			if($('.list_num').html().indexOf("외화다통화예금") > -1){
				if($('#trstListSize').val() == 0){
					if($('.list_num').html().indexOf("기업자유예금") == -1){
						hanaDialog.openAlert({title:"알림", message:"외화다통화예금 개설은 기업자유예금과 동시 개설시에만 가능합니다"});
						errorYn = "Y";
						return false;
					}					
				}				
			}			
			
			// 신규 고객은 기업자유예금, 전자금융 필수
			if($('#extgNewCustDvCd').val() == "2"){
				if($('.list_num').html().indexOf("기업자유예금") == -1 || $('.list_num').html().indexOf("기업전자금융") == -1){
					hanaDialog.openAlert({title:"알림", message:"비대면 채널을 통한 기업자유예금 신규는 기업전자금융 신규와 동시 진행됩니다."});
					errorYn = "Y";
					return false;					
				}					
			}		
			
			if(errorYn == "N"){
				$('.check_popup2').fadeIn(200,'easeInOutCirc');
			}			

		},		
		
		/**
		 * 신청 시작 화면 이동   
		 */		
		goCpuntact150 : function(formObj){	
			
			// 기존고객
//			if($('#extgNewCustDvCd').val() == "1"){
				
				// 예금상품신청시
				if($('#dpPrdApcYn').val() == "Y"){
					
					// 단기간 다수계좌 조회
					var hanaJQuery = new HanaJQuery(msb.HANA_CONTENT, true, null);
					hanaJQuery.ajaxSubmit("/untact/csuntact141.do", formObj, function(httpRequest, textStatus) {
						
						try{
							
							var data = jQuery.parseJSON(httpRequest.responseText);
							
							var nftfTrscLimtDvCd = data.nftfTrscLimtDvCd;
							
							if(nftfTrscLimtDvCd == "02" || nftfTrscLimtDvCd == "03" || nftfTrscLimtDvCd == "90"){
								hanaDialog.openAlert({title:"알림", message:"개설요청일 포함 20영업일 內 금융기관 계좌개설 이력 있으면 신규 계좌개설 불가합니다."});
								return false;							
							}
							
							// 상품신청 서비스 실행
							var hanaJQuery = new HanaJQuery(msb.HANA_CONTENT, true, null);
							hanaJQuery.ajaxSubmit("/untact/csuntact142.do", formObj, function(httpRequest, textStatus) {
								
								try{
									
									var data = jQuery.parseJSON(httpRequest.responseText);
									
									// 신청 시작 화면 이동
									msb.util.form.sendForm(formObj, '/untact/csuntact150.do');

								} catch(e) {
									hanaDialog.openAlert({title:"알림", message:"[" + e.code + "] " + e.message});
						        }							
									
							});

						} catch(e) {
							hanaDialog.openAlert({title:"알림", message:"[" + e.code + "] " + e.message});
				        }					

				    });				
				}else{
					// 상품신청 서비스 실행
					var hanaJQuery = new HanaJQuery(msb.HANA_CONTENT, true, null);
					hanaJQuery.ajaxSubmit("/untact/csuntact142.do", formObj, function(httpRequest, textStatus) {
						
						try{
							
							var data = jQuery.parseJSON(httpRequest.responseText);
							
							// 신청 시작 화면 이동
							msb.util.form.sendForm(formObj, '/untact/csuntact150.do');

						} catch(e) {
							hanaDialog.openAlert({title:"알림", message:"[" + e.code + "] " + e.message});
				        }							
							
					});	
				}				
			// 신규고객
//			}else{
//				// 상품신청 서비스 실행
//				var hanaJQuery = new HanaJQuery(msb.HANA_CONTENT, true, null);
//				hanaJQuery.ajaxSubmit("/untact/csuntact142.do", formObj, function(httpRequest, textStatus) {
//					
//					try{
//						
//						var data = jQuery.parseJSON(httpRequest.responseText);
//						
//						// 신청 시작 화면 이동
//						msb.util.form.sendForm(formObj, '/untact/csuntact150.do');
//
//					} catch(e) {
//						hanaDialog.openAlert({title:"알림", message:"[" + e.code + "] " + e.message});
//			        }							
//						
//				});				
//			}
			
		},
		
		/**
		 * 상세팝업 호출   
		 */		
		dtlsPoupOpen : function(arg) {
			if(arg == 1){
				layerOpen.init('#examLayer');			
			}else if(arg == 2){
				layerOpen.init('#examLayer02');
			}
		},		
		
		/**
		 * 상세팝업 버튼 컨트롤   
		 */			
		dtlsPoupFnc : function(arg) {
			
			// 예금상품,외화예금상품 가입
			if(arg == 1 || arg == 2){
				
				// 기업자유예금 미보유 손님이 외화다통화예금 선택시 기업자유예금 자동 선택 추가
				if(arg == 2){
					if($('#trstListSize').val() == 0){
						$('#li01').addClass('on');
					}
				}
				
				$('#li0'+arg+'').addClass('on');
				if($('#li00').hasClass('on')){
					var agreeQuantity = $('.check_list li.on').length - 1				
				}else{
					var agreeQuantity = $('.check_list li.on').length
				}				
				if(agreeQuantity > 0){
					$('.btn_fix').fadeIn(200,'easeInOutCirc');
				}
				
				var agreeLength = $('.check_list li').length - 1
				
				if(agreeLength == agreeQuantity){
					$('#li00').addClass('on');
				}else{
					$('#li00').removeClass('on');
				}
				
				$('.list_sum').text(agreeQuantity);
				$('.j_btn_fix').show();					
			// 예금상품,외화예금상품 취소
			}else if(arg == 3 || arg == 4){
//				if(arg == 3){
//					$('#li01').removeClass('on')				
//				}else if(arg == 4){
//					$('#li02').removeClass('on')
//				}
				if($('#li00').hasClass('on')){
					var agreeQuantity = $('.check_list li.on').length - 1				
				}else{
					var agreeQuantity = $('.check_list li.on').length
				}
				if(agreeQuantity <= 0){
					$('.btn_fix').fadeOut(200,'easeInOutCirc');
				}
				$('.list_sum').text(agreeQuantity)
				if(agreeQuantity == 0){						
					$('.j_btn_fix').hide();
				}
			}
			
		},		
		
		/**
		 * 상품설명서 및 이용약관
		 */
		goPrdDesc : function(index) {
		 
			var hanaJQuery = new HanaJQuery(msb.HANA_CONTENT, true);
			hanaJQuery.ajaxSubLoad('/untact/csuntact143.do?index=' + index, null,function() {
			}, false);
			
		},		
		
		setIrt: function(curCd) {
			var frmObj = document.createElement('form');
			msb.util.form.createHiddenField(frmObj, 'cd', "0100109000101");
			msb.util.form.createHiddenField(frmObj, 'cdNm', "외화보통예금");
			msb.util.form.createHiddenField(frmObj, 'inqStrDt', $('#todayYyyyMMdd').val()); // yyyyMMdd
			msb.util.form.createHiddenField(frmObj, 'inqEndDt', $('#todayYyyyMMdd').val());
			msb.util.form.createHiddenField(frmObj, 'curCd3', curCd);
			msb.util.form.createHiddenField(frmObj, 'irtCd', "01001090001013200");
			msb.util.form.createHiddenField(frmObj, 'irtKindCd', "01");
			
			$('#irtApclStrDt1').text('-'); // yyyy.mm.dd
			$('#irtApclEndDt1').text('-');
			$('#irt1').text('-%');
			$('#irtApclStrDt2').text('-');
			$('#irtApclEndDt2').text('-');
			$('#irt2').text('-%');
			
			var hanaJQuery = new HanaJQuery(msb.HANA_CONTENT, false, null);
			hanaJQuery.ajaxSubmit('/untact/csuntact053.do', frmObj, function(httpRequest, textStatus){
				var data = jQuery.parseJSON(httpRequest.responseText);
				
				var irt1Info = null; 
				var irt2Info = null;
				
				var irtInfos = data['contMap']['BIZ.PFP0022.OUT.REC'];
				
				for(var i = 0; i < irtInfos.length; i++) {
					var desc = irtInfos[i].irtDesc;
					if(desc === "거주자") {
						irt1Info = irtInfos[i];
					}
					else if(desc === "비거주자") {
						irt2Info = irtInfos[i];
					}
				}
				
				var irt1 = Number(irt1Info.irt).toFixed(4); // 거주자 금리
				var irt2 = Number(irt2Info.irt).toFixed(4); // 비거주자 금리
				var irtStrDt1 = irt1Info.irtTrmStrRangCtt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3');
				var irtEndDt1 = irt1Info.irtTrmEndRangCtt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3');
				var irtStrDt2 = irt2Info.irtTrmStrRangCtt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3');
				var irtEndDt2 = irt2Info.irtTrmEndRangCtt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3');
				
				$('#irtApclStrDt1').text(irtStrDt1); // yyyy.mm.dd
				$('#irtApclEndDt1').text(irtEndDt1);
				$('#irt1').text(irt1 + '%');
				$('#irtApclStrDt2').text(irtStrDt2);
				$('#irtApclEndDt2').text(irtEndDt2);
				$('#irt2').text(irt2 + '%');
				
			});
		},		
		
		dummy : null
	};
	
}();

//# sourceURL=ibk-csw-untact-untact140.js
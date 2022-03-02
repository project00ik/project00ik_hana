/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact512.js
 * 작성일 : 2021. 04. 08
 * 작성자 : 신성환
 * 설 명 : 인증(사업자서류제출) - 실제소유자확인 서류
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact512 = function(){
	
	return{
		
		/**  
		 * 첨부서류 등록
		 */
		apnxDcmtReg : function (fis){
			
			swiper = new Swiper('.swiper-container', {
			    slidesPerView : 3,
			    spaceBetween : 10,
			    slidesPerGroup : 1,
			    navigation : {
			        nextEl : '.swiper-button-next',
			        prevEl : '.swiper-button-prev',
			    }
			});			
			
			var filesLength = fis.files.length;
			
			for(var idx = 0; idx < filesLength; idx++){
				
				var promise = pFileReader(fis);
				promise.then(function (result){
					HanaAppInterface.endLoadingDialog();
					$('.swiper-button-prev').show();
					$('.swiper-button-next').show();					
					if($("#swiperUl").find("img[name=apnxDcmtImg]").length > 0){
						$('#document-01').addClass('disabled').prop('disabled','disabled');
						$('#document-02').addClass('disabled').prop('disabled','disabled');
					}else{
						$('#document-01').addClass('disabled').prop('disabled','');
						$('#document-02').addClass('disabled').prop('disabled','');
					}					
				})
				
				function pFileReader(fis){
					return new Promise(function(resolve, reject) {
						var fileName = fis.files[idx].name;
						HanaAppInterface.startLoadingDialog();
						var reader = new FileReader();			
						reader.onload = function(e){
							
							var imgCnt = $("#swiperUl").find("img[name=apnxDcmtImg]").length + 1;
							
							if(imgCnt > 20){
								hanaDialog.openAlert({title:"알림", message:"최대20개 까지 첨부 가능 합니다."});
								return false;			
							}					
							
							// 첨부 서류 숫자 증가
							$("#prsShCnt").text(imgCnt);
							$("#prsShCnt").addClass('color01');
							
							// PDF 파일 썸네일 처리
							if(fileName.substring(fileName.indexOf(".")+1) == "pdf"){
					 			var imgTag = '<li class="swiper-slide" id="swiper-slide_'+imgCnt+'" name="swiper-slide">' + 
								 			 	'<div class="document_img pdf">' +
								 			 	'<img src="'+e.target.result+'" name="apnxDcmtImg" />'+
								 					'<button type="button" class="img_del" value="'+fileName+'" onclick="ibk.csw.untact.untact512.apnxDcmtDel(this);">삭제</button>'+
								 				'</div>'+
								 			 '</li>';					
							}else{
					 			var imgTag = '<li class="swiper-slide" id="swiper-slide_'+imgCnt+'" name="swiper-slide">' + 
							 				 	'<div class="document_img">' +
							 						'<img src="'+e.target.result+'" name="apnxDcmtImg" />'+
							 						'<button type="button" class="img_del" value="'+fileName+'" onclick="ibk.csw.untact.untact512.apnxDcmtDel(this);">삭제</button>'+
							 					'</div>'+
							 				 '</li>';					
							}
							
							swiper.appendSlide(imgTag);
							resolve(fis.files[idx]);
					    }			
						reader.readAsDataURL(fis.files[idx]);
					});					
				}
							
			}
			
			$("#sendFile").val("");				
			
		},		
		
		/**  
		 * 첨부서류 삭제
		 */
		apnxDcmtDel : function (obj){
			
			var imgIndex =  $(obj).parent().parent().attr("id").substr(13);
			
			swiper.removeSlide(imgIndex-1);
			swiper.update();
			
			$("#swiperUl").find("li[name=swiper-slide]").each(function(index){
				this.id = 'swiper-slide_'+(index+1);
			});		
			$("#prsShCnt").text($("#swiperUl").find("img[name=apnxDcmtImg]").length);
			if($("#prsShCnt").text() == "0"){
				$("#prsShCnt").removeClass('color01');
				$('.swiper-button-prev').hide();
				$('.swiper-button-next').hide();
			}			
					
			if($("#swiperUl").find("img[name=apnxDcmtImg]").length == 0){
				$('#document-01').addClass('disabled').prop('disabled','');
				$('#document-02').addClass('disabled').prop('disabled','');
			}			
			
		},
		
		/**  
		 * 사업자 서류 제출
		 */
		enprDcmtSbmt : function (formObj){

			// 첨부서류 이미지 갯수
			var imgCnt = $("img[name=apnxDcmtImg]").length;			
			var imgSeqNo = 1;
			
			if(imgCnt < 1){
				hanaDialog.openAlert({title:"알림", message:"첨부된 파일이 없습니다."});
				return false;
			}else if(imgCnt > 20){
				hanaDialog.openAlert({title:"알림", message:"최대20개 까지 첨부 가능 합니다."});
				return false;			
			}
			
			if($("#apcNo").val() == ""){
				hanaDialog.openAlert({title:"알림", message:"거래 가능한 세션이 존재 하지 않습니다.처음부터 다시 거래하여 주시기 바랍니다."});
				return false;
			}			
			
			if($('#document-01').is(':checked')){
				$("#crpnNftfEvdcDcmtKindCd").val("41");
			}else if($('#document-02').is(':checked')){
				$("#crpnNftfEvdcDcmtKindCd").val("42");
			}			
			
			// 회차 조회
			var hanaJQuery = new HanaJQuery(msb.HANA_CONTENT, true, null);
			hanaJQuery.ajaxSubmit("/untact/csuntact515.do", formObj, function(httpRequest, textStatus) {
				
				try{
					
					var data = jQuery.parseJSON(httpRequest.responseText);
					
					// 회차번호
					msb.util.form.createHiddenField(formObj, 'sqnNo', (data.sqnNo+1));
					
					// 암호화 객체 지원가능 브라우저 확인
					if(!SCCipherIsSupport()){
						hanaDialog.openAlert({title:"알림", message:"이미지 암호화 기능 미지원 브라우저입니다."});
						return false;
					}
					
					// SCCipher 초기화
					var webCrypto = SCCipher.CryptoNew();					
					
					// 서류제출 실행						
	 				ibk.csw.untact.untact512.enprDcmtSbmtExec(formObj,webCrypto,1,imgCnt);

				} catch(e) {
					hanaDialog.openAlert({title:"알림", message:"[" + e.code + "] " + e.message});
		        }					

		    });			
			
		},		
		
		/**  
		 * 사업자 서류 제출 실행
		 */
		enprDcmtSbmtExec : function (formObj,webCrypto,imgIdx,imgCnt){

			HanaAppInterface.startLoadingDialog();
			
			var serverObj = SERVER_SECTION;
			var serverInfo = ibk.csw.untact.common.serverChk(serverObj);						
			
			// 업무서버 경로
			var webUrl = (serverInfo == 'dev11-' || serverInfo == 'stg11-')?'https://'+serverInfo+'mbiz.hanabank.com:19190/wizvera/sccipher/svc/scinit.jsp':'https://mbiz.hanabank.com/wizvera/sccipher/svc/scinit.jsp';			
			
			SCCipherInit(webUrl, webCrypto).then(function(){
				
				var swiperSlide = $("#swiper-slide_"+imgIdx+"");
				
				// base64 원본이미지
				var imgData = swiperSlide.find("img").attr("src").substring(swiperSlide.find("img").attr("src").indexOf("base64,")+7);				
				
				// 데이터 암호화
				var abData = SCCipher.Encoder.AB.fromStr(imgData);
				var encDataPromise = SCCipherEncrypt(abData, webCrypto);
				encDataPromise.then(function(encData) {
					
					imgData = "";
					abData = "";					
					
					var imgEncData = SCCipher.Encoder.AB.toB64(encData);
					msb.util.form.createHiddenField(formObj, 'imgEncData', imgEncData);
					
					var sendFileNm = swiperSlide.find("button").attr("value");
					msb.util.form.createHiddenField(formObj, 'sendFileNm', sendFileNm);
					
					encData = "";
					imgEncData = "";					
					
					// 첨부파일종류
					if(sendFileNm.indexOf("jpg") > -1 || sendFileNm.indexOf("jpeg") > -1){
						msb.util.form.createHiddenField(formObj, 'crpnNftfApnxFileKindCd', '1');	
					}else if(sendFileNm.indexOf("png") > -1){
						msb.util.form.createHiddenField(formObj, 'crpnNftfApnxFileKindCd', '2');
					}else if(sendFileNm.indexOf("gif") > -1){
						msb.util.form.createHiddenField(formObj, 'crpnNftfApnxFileKindCd', '3');
					}else if(sendFileNm.indexOf("bmp") > -1){
						msb.util.form.createHiddenField(formObj, 'crpnNftfApnxFileKindCd', '4');
					}else if(sendFileNm.indexOf("pdf") > -1){
						msb.util.form.createHiddenField(formObj, 'crpnNftfApnxFileKindCd', '5');
					}else{
						hanaDialog.openAlert({title:"알림", message:"이미지파일(jpg, jpeg, png, gif, bmp), PDF파일만 가능합니다."});
						return false;							
					}
					
					// 일련번호
					msb.util.form.createHiddenField(formObj, 'seqNo', imgIdx);
					
					// 사업자 서류제출 실행
					var hanaJQuery = new HanaJQuery(msb.HANA_CONTENT, true, null);
					hanaJQuery.ajaxSubmit("/untact/csuntact514.do", formObj, function(httpRequest, textStatus) {
						
						try{
							
							var data = jQuery.parseJSON(httpRequest.responseText);
							
							if (data.result == 'success') {
								if(imgIdx == imgCnt){
									HanaAppInterface.endLoadingDialog();
									
									// 서류제출 완료
									var hanaJQuery = new HanaJQuery(msb.HANA_CONTENT, true, null);
									hanaJQuery.ajaxSubmit("/untact/csuntact516.do", formObj, function(httpRequest, textStatus) {
										
										var data = jQuery.parseJSON(httpRequest.responseText);
										
										if (data.result == 'success') {
											// 다음 서류 제출 화면 이동
											HanaAppInterface.startLoadingDialog();
											msb.util.form.sendForm(formObj, '/untact/csuntact513.do');
										}else if(data.result == 'error'){
											HanaAppInterface.endLoadingDialog();
											hanaDialog.openAlert({title:"알림", message:data.errorMsg});
										}
										
									});
									
								}else{
									// 다음건  서류제출 실행
									HanaAppInterface.endLoadingDialog();
	 								ibk.csw.untact.untact512.enprDcmtSbmtExec(formObj,webCrypto,(imgIdx+1),imgCnt);
								}
							}else if(data.result == 'error'){
								HanaAppInterface.endLoadingDialog();
								hanaDialog.openAlert({title:"알림", message:"사업자 서류제출에 실패하였습니다."});
							}
						} catch(e) {
							HanaAppInterface.endLoadingDialog();
							hanaDialog.openAlert({title:"알림", message:"[" + e.code + "] " + e.message});
				        }					

				    });								
					
				}).catch(function(e) {
					HanaAppInterface.endLoadingDialog();
					hanaDialog.openAlert({title:e.code, message:"[" + e.message + "] " + e.message});
				});
			})			

		},		

		dummy : null
	};
	
}();

//# sourceURL=ibk-csw-untact-untact512.js
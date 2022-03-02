/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact501.js
 * 작성일 : 2021. 03. 29
 * 작성자 : 신성환
 * 설 명 : 인증(신분증인증)
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/
ibk.csw.untact.untact501 = function(){
	
	return{
		
		nativeCallback: function(arg) {
			// 전체 파일 삭제 성공시 true , 파일 삭제중 하나의 항목이라도 에러시 false
//			alert("콜백파라메터=====" + arg);
		},		
		
		/**  
		 * 발급일자 포맷팅
		 */		
		chIdcd : function (objId){
			
			var objValue =  $('#'+objId).val().replace(/\-/gi, '').replace(/\./gi, '');

			if (objValue.length > 6) {
				var date1 = objValue.substring(0, 4);
				var date2 = objValue.substring(4, 6);
				var date3 = objValue.substring(6, objValue.length);
				$("#"+objId).val(date1+'.'+date2+'.'+date3);
			} else if (objValue.length > 4) {
				var date1 = objValue.substring(0, 4);
				var date2 = objValue.substring(4, objValue.length);
				$("#"+objId).val(date1+'.'+date2);
			} else {
				$("#"+objId).val(objValue);
			}
			
		},		
		
		/**  
		 * 신분증 촬영
		 */
		idcdCameraStart : function() {
			
			if(!SCCipherIsSupport()){
				hanaDialog.openAlert({title:"알림", message:"이미지 암호화 기능 미지원 브라우저입니다."});
				return false;
			}			

			var ocrCrypto = SCCipher.CryptoNew();
			var options = {
				width: 1280
				,height: 720
				,autorotate : false
			};
			
			//화면 출력
			var imageFilter = function(arrayBuffer) { // 암호화시 어레이버퍼에 담긴 이미지를 dataUrl로 가공
				var imageType = 'image/jpeg';
				return new Promise(function(resolve, reject) {
					var dataUrl = ibk.csw.sccipher.getDataURIfromArrayBuffer(arrayBuffer, imageType);
					$('#cameraImg').attr('src', dataUrl);
					resolve(arrayBuffer);
				});
			}
			
			//암호화 처리
			var encDataPromise = SCCipherCameraShot(options, false, ocrCrypto, imageFilter).catch(function(e) {
				hanaDialog.openAlert({title:"알림", message:"[" + e.code + "] " + e.message});
				return false;
			});
			encDataPromise.then(function(encData) {
				
				$('input[name=imgEncData]').val(SCCipher.Encoder.AB.toB64(encData));
				
				// ocr 호출 횟수 누적
				var tryCount = $('#tryCount').val();
				tryCount++;
				$('#tryCount').val(tryCount);
				
				// ocr 신분증 인증
				var hanaJQuery = new HanaJQuery(null, true);
				hanaJQuery.ajaxSubmit("/untact/csuntact502.do", document.getElementById("untact501Form"), function(httpRequest, textStatus){

					try{
						
						var data = jQuery.parseJSON(httpRequest.responseText);
						
						if(oPLATFORM.IPHONE()){
							location.href = "native://emptyTmpDirectory?cbName=ibk.csw.untact.untact501.nativeCallback";
						}						
						
						if (data.result == 'success') {
							
							if(data.idcdDvCd == '12'){
								// 재외국민은 오류 처리
								layerOpen.init('#layerpopup02')
							}else{
								
								$('#guide_section').hide();
								$('#contents01').show();
								$('.txt_notice02').show();
								$('.j_btn_fix').show();
								
								if(data.idcdDvCd == '01'){
									$('#result_idCard_1').show();

									$('#idcdIssuDt_idCard_1').val(data.idcdIssuDt);				// 발급일자
									ibk.csw.untact.untact501.chIdcd('idcdIssuDt_idCard_1');		// 발급일자 '.'넣어서 set

									$('#div01').show();
									$('#div02').hide();									
									
								}else if(data.idcdDvCd == '02'){
									$('#result_idCard_2').show();
									
									$('#drlcNo1').val(data.drlcNo1);							// 면허번호 첫째자리
									$('#drlcNo2').val(data.drlcNo2);							// 면허번호 둘째자리
									$('#drlcNo4').val(data.drlcNo4);							// 면허번호 넷째자리
									$('#idcdIssuDt_idCard_2').val(data.idcdIssuDt);				// 발급일자
									ibk.csw.untact.untact501.chIdcd('idcdIssuDt_idCard_2');		// 발급일자 '.'넣어서 set
									
									$('#div01').hide();
									$('#div02').show();									
									
								}
								
								//특징점 추출
								$("#idcdOtxtPotoImgPath").val(data.img); //사진원본
								
								//SEBK0065A001 신분증진위확인 요청 데이터 셋팅
								$("#idcdDvCd").val(data.idcdDvCd); // 01: 주민등록, 02: 운전면허
								$("#issuDt").val(data.idcdIssuDt); // 발급일자
								
								var decoded = SCCipher.Encoder.AB.fromB64(data.maskImg);
								SCCipherDecrypt(decoded, ocrCrypto).then(function(decrypted) {
									$('#cameraImg').attr('src', SCCipher.Encoder.AB.toStr(decrypted));
								}).catch(function(e) {
									hanaDialog.openAlert({title:"알림", message:"에러코드:[" + e.code + "] " + e.message});
								});
							}
						}else if(data.result == 'error'){	
							// 신분증 인식실패
							layerOpen.init('#layerpopup01');
							$('#div01').hide();
							$('#div02').hide();
							$('.txt_notice02').hide();
							$('.j_btn_fix').hide();
						}else if(data.result == 'error2'){
			        		hanaDialog.openAlert({title:"알림", message:"대표자의 실명번호가 상이합니다.", fCallback1:function(){	
			        			msb.util.form.sendForm(document.getElementById("untact501Form"), '/untact/untact_index.do?nftfChnlKindCd=MW02809A01');
			        		}});
			        		return false;							
						}else if(data.result == 'error3'){
			        		hanaDialog.openAlert({title:"알림", message:"면허번호가 12자리인 숫자만 촬영가능합니다.", fCallback1:function(){	
			        			msb.util.form.sendForm(document.getElementById("untact501Form"), '/untact/untact_index.do?nftfChnlKindCd=MW02809A01');
			        		}});
			        		return false;							
						}
					} catch(e) {
						// OCR모듈 오류
						$('#div01').hide();
						$('#div02').hide();
						$('.txt_notice02').hide();
						$('.j_btn_fix').hide();
			        }
				});				
				
			}).catch(function(e) {
				hanaDialog.openAlert({title:"알림", message:"[" + e.code + "] " + e.message});
			});			
			
		},		
		
		/**
		 * 신분증 진위확인
		 */
		idcdTnfCnfm : function(formObj){
			
			if($("#idcdDvCd").val() == '01'){
				var idcdIssuDt_idCard_1 = $('#idcdIssuDt_idCard_1').val().replace(/[^0-9]/g, '');
				if(idcdIssuDt_idCard_1.length == 8){
					$("#issuDt").val(idcdIssuDt_idCard_1);
				}else{
					hanaDialog.openAlert({title:"알림", message:'발급일자를 확인 후 입력해주세요.'});
					return false;
				}
			}else if($("#idcdDvCd").val() == '02'){
				var idcdIssuDt_idCard_2 = $('#idcdIssuDt_idCard_2').val().replace(/[^0-9]/g, '');
				if(idcdIssuDt_idCard_2.length == 8){
					$("#issuDt").val(idcdIssuDt_idCard_2);
				}else{
					hanaDialog.openAlert({title:"알림", message:'발급일자를 확인 후 입력해주세요.'});
					return false;
				}
				
				var drlcNo1 = $('#drlcNo1').val(); 
				var drlcNo2 = $('#drlcNo2').val().replace(/[^0-9]/g, '');
				var drlcNo3 = $('#drlcNo3').val();
				var drlcNo4 = $('#drlcNo4').val().replace(/[^0-9]/g, '');
				
				if(drlcNo1.length < 2 || drlcNo2.length != 2 || $('#drlcNo3').val().length != 6 || drlcNo4.length != 2){					
					hanaDialog.openAlert({title:"알림", message:"면허번호를 확인 후 입력해주세요."});
					return false;
				}
				
			}
			
			//암호화 처리 시 반드시 호출
			mtk.fillEncData();
			
			// 회차 조회
			var hanaJQuery = new HanaJQuery(msb.HANA_CONTENT, true, null);
			hanaJQuery.ajaxSubmit("/untact/csuntact515.do", formObj, function(httpRequest, textStatus) {
				
				try{
					
					var data = jQuery.parseJSON(httpRequest.responseText);
					
					// 회차번호
					msb.util.form.createHiddenField(formObj, 'sqnNo', (data.sqnNo+1));
					
					// 신분증 진위 확인
					var hanaJQuery = new HanaJQuery(msb.HANA_CONTENT, true, null);
					hanaJQuery.ajaxSubmit("/untact/csuntact503.do", formObj, function(httpRequest, textStatus) {

				        try {
				        	
				        	var oJsonData = jQuery.parseJSON(httpRequest.responseText);

				        	var errMsg = '';
				        	
				        	//신분증촬영 OCR정보 없음
				        	if(oJsonData.errorCode == 'BNFT10001'){
				        		errMsg += '신분증 촬영 정보 없음.<br/>재접속 후 거래 진행 바랍니다.';
				        		hanaDialog.openAlert({title:"알림", message:errMsg, fCallback1:function(){	
				        			ibk.csw.common.fnAppFinish(null);
				        		}});
				        		return false;
				        	}
				        	
				        	//신분증촬영 OCR정보와 고객정보 불일치
				        	if(oJsonData.errorCode == 'BNFT20053'){
				        		errMsg += '신분증 정보가 휴대폰인증 고객정보와 일치하지 않아 재촬영이 진행됩니다.<br/>촬영 후 신분증 정보를 꼭 확인해 주세요.';
				        		
				        		hanaDialog.openAlert({title:"알림", message:errMsg, fCallback1:function(){
				        			ibk.csw.untact.untact501.idcdCameraStart();
				        		}});
				        		return false;
				        	}
				        	
				        	/*
				        	 * 0001 : 화면에서 즉시 재촬영:발급일자 등 오류
				        	 * 0002 : 화면에서 즉시 재촬영 및 장애 안내 팝업:장애코드 시(팝업 안내 후 신분증 촬영 안내(간지) 화면으로 이동
				        	 * 0003 : 화면에서 즉시 재촬영:일시적인 오류 기타 코드(팝업 안내 후 신분증 촬영 안내(간지) 화면으로 이동
				        	 * 0004 : 화면에서 즉시 재촬영:사진 불일치 1~4회
				        	 * 0005 : 승인거절 요청:신분증 사본 촬영
				        	 * 0006 : 자동 승인거절:사진 불일치 5회
				        	 * 0007 : 자동 승인거절:사용할 수 없는 신분증
				        	 * 0008 : 자동 승인거절:1Q 손님불편개선 실명확인 재촬영 거래 없음, 무조건 재신청
				        	 */
				        	
				        	// 화면에서 즉시 재촬영 - 발급일자 등 오류
				        	if(oJsonData.errorCode == '0001'){
				        		errMsg += '신분증 정보가 일치하지 않아 재촬영이 진행됩니다.<br/>촬영 후 신분증 정보를 꼭 확인해 주세요.';
				        		
				        		hanaDialog.openAlert({title:"알림", message:errMsg, fCallback1:function(){	
				        			ibk.csw.untact.untact501.idcdCameraStart();
			        			}});
				        		return false;
				        	}

				        	// 화면에서 즉시 재촬영 및 장애 안내 팝업 - 장애코드 시
				        	if(oJsonData.errorCode == '0002'){
				        		errMsg += '현재 신분증 진위확인 서비스 이상으로 신분증 제출이 불가능합니다.(발급기관 장애 등)';
				        		errMsg += '잠시 후에 이어서 신청하시기 바랍니다.(휴대폰 본인인증 후 진행)';
				        		errMsg += '<br/><br/>';
				        		errMsg += '※ 문의: 고객센터 1599-2111';
				        		
				        		hanaDialog.openAlert({title:"알림", message:errMsg, fCallback1:function(){	
				        			ibk.csw.common.fnAppFinish(null);
				        		}});

				        		return false;
				        	}

				        	// 화면에서 즉시 재촬영 - 일시적인 기타 오류 코드
				        	if(oJsonData.errorCode == '0003'){
				        		errMsg += '발급기관을 통한 신분증 진위확인이 실패하였습니다. 다시 촬영해 주세요.';
				        		
				        		hanaDialog.openAlert({title:"알림", message:errMsg, fCallback1:function(){	
				        			ibk.csw.common.fnAppFinish(null);
				        		}});

				        		return false;
				        	}

				        	// 화면에서 즉시 재촬영 - 사진 불일치 1 ~ 4회
				        	if(oJsonData.errorCode == '0004'){
				        		errMsg += '<div style="font-size:2rem;">신분증 진위확인 실패</div><br/><br/>';
				        		errMsg += '<div style="text-align:left">';
				        		errMsg += '발급기관을 통한 진위확인에 ' + oJsonData.rspsCd.replace("XX", "") + '회 실패하였습니다. 5회 실패 시 거래가 거절되니 아래 내용 확인 후 다시 촬영해 주세요.<br/><br/>';
				        		errMsg += '① 신분증 원본 촬영<br/>';
				        		errMsg += '② 빛 번짐과 흔들림이 없는지 확인<br/>';
				        		errMsg += '③ 촬영 장소가 너무 어둡거나 밝다면 장소를 이동<br/>';
								errMsg += '④ 신분증이 훼손되었다면 다른 신분증으로 교체';
								errMsg += '</div>';
								
								hanaDialog.openAlert({title:"알림", message:errMsg, fCallback1:function(){
									ibk.csw.untact.untact501.idcdCameraStart();
			        			}});
				        		return false;
				        	}

				        	// 승인거절 요청 - 신분증 사본 촬영
				        	if(oJsonData.errorCode == '0005'){
				        		hanaDialog.openAlert({title:"알림", message:"신분증 사본으로 비대면 실명확인<br/>거래를 이용하실 수 없습니다.<br/>원본으로 처음부터 다시 신청하시기 바랍니다.", fCallback1:function(){
				        			ibk.csw.untact.untact501.idcdCameraStart();
								}});
				        		
				        		return false;
				        	}

				        	// 자동 승인거절 - 사진 불일치 5회
				        	if(oJsonData.errorCode == "0006"){
				        		errMsg += '<div style="font-size:2rem;">신분증 진위확인 실패</div><br/><br/>';
				        		errMsg += '발급기관을 통한 진위확인이 최종 실패하여<br/>';
				        		errMsg += '비대면 실명확인 서비스를 이용하실 수 없습니다.<br/>';
				        		errMsg += '영업점을 내점하시거나 다른 신분증으로<br/>';
				        		errMsg += '처음부터 다시 신청해 주시기 바랍니다.<br/><br/>';
				        		errMsg += '※ 문의: 고객센터 1599-2111';
				        		
				        		hanaDialog.openAlert({title:"알림", message:errMsg, fCallback1:function(){	
				        			ibk.csw.common.fnAppFinish(null);
				        		}});

				        		return false;
				        	}
				        	
				        	// 자동 승인거절 - 사용할 수 없는 신분증
				        	if(oJsonData.errorCode == '0007'){
				        		errMsg += '<div style="font-size:2rem;">신분증 진위확인 실패</div><br/><br/>';
				        		errMsg += '발급기관을 통한 진위확인이 실패하여<br/>';
				        		errMsg += '비대면 실명확인 서비스를 이용하실 수 없습니다.<br/>';
				        		errMsg += '(분실,재발급,정보 불일치 등)<br/><br/>';
				        		errMsg += '※ 문의: 고객센터 1599-2111';
				        		
				        		hanaDialog.openAlert({title:"알림", message:errMsg, fCallback1:function(){
				        			ibk.csw.common.fnAppFinish(null);
				        		}});

				        		return false;
				        	}
				        	
				        	// 자동 승인거절 - 1Q 손님불편개선 실명확인 재촬영 거래 없음, 무조건 재신청
			        		if(oJsonData.errorCode == '0008'){
			        			errMsg += '신분증 정보가 일치하지 않습니다.<br/>재신청 해주시기 바랍니다.';

			        			hanaDialog.openAlert({title:"알림", message:errMsg, fCallback1:function(){
		        					ibk.csw.common.fnAppFinish(null);
		        				}});
			        			
			        			return false;
			        		}
				        	
			        		// App OCR(SDK) 정상처리
			        		hanaDialog.openAlert({title:"알림", message:"신분증이 정상적으로 제출되었습니다.", fCallback1:function(){
			        			msb.util.form.sendForm(formObj, '/untact/csuntact510.do');
		        			}});

				        } catch(e) {
				        	hanaDialog.openAlert({title:"알림", message:"[" + e.code + "] " + e.message});
				        }
				    });					


				} catch(e) {
					hanaDialog.openAlert({title:"알림", message:"[" + e.code + "] " + e.message});
		        }					

		    });			
			
		}		
		
	};
	
}();

//# sourceURL=ibk-csw-untact-untact501.js
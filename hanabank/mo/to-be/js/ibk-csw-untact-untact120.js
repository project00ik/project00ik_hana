/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact120.js
 * 작성일 : 2021. 03. 03
 * 작성자 : 김이준
 * 설 명 : 비대면 - 법인정보 확인
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact120 = function(){
	
	return{
		
		validateUntact120 : function(){
			
//			if($('#csEnprNm').val().length <= 0){
//				ibk.csw.common.openAlert({title:"알림", message:'사업자명을 입력하여주세요.'});
//				$('#csEnprNm').focus();
//				return false;
//			}
			if($('#csBzRegNo').val().length <= 0){
				ibk.csw.common.openAlert({title:"알림", message:'사업자등록번호를 입력하여 주세요.'});
				$('#csBzRegNo').focus();
				return false;
			}
			if($('#csCrpnRegNo2').val().length <= 0){
				ibk.csw.common.openAlert({title:"알림", message:'법인등록번호를 입력하여 주세요.'});
				$('#csCrpnRegNo2').focus();
				return false;
			}
			if($('#csCrpnRegNo2').val().length < 14){
				ibk.csw.common.openAlert({title:"알림", message:'법인등록번호 13자리를 입력하여 주세요.'});
				$('#csCrpnRegNo2').focus();
				return false;
			}
//			if($('#csBzRegIssueNo').val().length <= 0){
//				ibk.csw.common.openAlert({title:"알림", message:'사업자등록증명원 발급번호을 입력하여주세.'});
//				$('#csBzRegIssueNo').focus();
//				return false;
//			}
			return true;
		},
		bizRegNoChange : function(obj){
			var bzRegNo = obj.value.trim();
//			if(bzRegNo <= 6 ){
//				obj.value =  bzRegNo.substring(0, 6);
//			}
//			ibk.csw.untact.common.onlyNumber(obj);
			bzRegNo = bzRegNo.replace(/[^0-9]/g,'');
			obj.value = bzRegNo;
			if(bzRegNo.length > 7 || bzRegNo.length == 14){
				var team =  bzRegNo.substring(0, 6)+ "-" + bzRegNo.substring(6,13);
//				var checkvalue = bzRegNo.substring(4, 6);
//				if(checkvalue != 11){
//					alert("법인 비대면 실명확인 서비스 가입 대상이 아닙니다");
//					return false;
//				}
//				console(checkvalue);
				obj.value = team;
			} 
			
			
		},
		
		/**
		 * 법인정보 확인
		 */		
		goSubmit : function(form){
			if(!ibk.csw.untact.untact120.validateUntact120()){
				return;
			}
			var csCrpnRegNo = $("#csCrpnRegNo2").val().replace(/[^0-9]/g,'');
			
			var checkvalue = csCrpnRegNo.substring(4, 6);
			if(checkvalue != 11){
				ibk.csw.common.openAlert({title:"알림", message:"법인 비대면 실명확인 서비스 가입 대상이 아닙니다"});
				return false;
			}
			$("#csCrpnRegNo").val(csCrpnRegNo);
			
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit("/untact/csuntact121.do", form, function(resultData,status){
				var data = jQuery.parseJSON(resultData.responseText);
				
				var Url =  '/untact/'+data.nextPageUrl+'.do';
				var masg = "";
				
				if("N" == data.nextPageUrl){

					masg = "법인 대표자 고객확인 화면으로 이동합니다. 대표자 고객확인 완료 후 하나원큐 기업앱에서 다시 진행해 주시기 바랍니다.["+data.nftfVrfcErrCd+"]";
					if("C19" == data.nftfVrfcErrCd){
						masg = "하나은행에 등록되어 있는 대표자 개인의 자택 주소를 도로명주소로 변경해야 법인 비대면 계좌개설 진행이 가능합니다.확인 버튼을 누르면 주소 변경 화면으로 이동합니다. 주소변경 및 고객확인 업무 수행 후 하나원큐 기업 앱을 재실행하여 '진행상태조회'에서 이어서 진행 해 주세요.["+data.nftfVrfcErrCd+"]";
					}
					if("C20" == data.nftfVrfcErrCd){
						masg = "하나은행에 등록되어 있는 대표자 개인의 직장 주소를 도로명주소로 변경해야 법인 비대면 계좌개설 진행이 가능합니다.확인 버튼을 누르면 주소 변경 화면으로 이동합니다. 주소변경 및 고객확인 업무 수행 후 하나원큐 기업 앱을 재실행하여 '진행상태조회'에서 이어서 진행 해 주세요.["+data.nftfVrfcErrCd+"]";
					}
					if("C21" == data.nftfVrfcErrCd){
						masg = "하나은행에 등록되어 있는 대표자 개인의 자택및직장 주소를 도로명주소로 변경해야 법인 비대면 계좌개설 진행이 가능합니다.확인 버튼을 누르면 주소 변경 화면으로 이동합니다. 주소변경 및 고객확인 업무 수행 후 하나원큐 기업 앱을 재실행하여 '진행상태조회'에서 이어서 진행 해 주세요.["+data.nftfVrfcErrCd+"]";
					}

					hanaDialog.openConfirm({title:"알림", message:masg, fCallback1:function(){
						
						if(SERVER_SECTION == "dev"){
							window.open("https://dev11-m.kebhana.com:18680/untact/untact_index.do?nftfChnlKindCd=MW02807A01");
							ibk.csw.common.fnAppFinish(null);
						}else if(SERVER_SECTION == "stg"){
							window.open("https://stg11-m.kebhana.com:18680/untact/untact_index.do?nftfChnlKindCd=MW02807A01");
							ibk.csw.common.fnAppFinish(null);
						}else{
							window.open("https://m.kebhana.com/untact/untact_index.do?nftfChnlKindCd=MW02807A01");
							ibk.csw.common.fnAppFinish(null);
						}
						
	        		},fCallback2:function(){}});
					
				}else if("csuntact700" == data.nextPageUrl){
					var massge = "현재 신청 진행중인 상품이 있습니다. 내역을 확인해 주세요.";
					hanaDialog.openAlert({title:"알림", message:massge, fCallback1:function(){	
						ibk.csw.untact.common.notFormSubmit(Url , form);
	        		}});
				}else{
					//ibk.csw.common.lodingProgress(500);
					msb.util.form.sendForm(form, Url);
				}
					
			});	
		
		}

	};
	
}();

//# sourceURL=ibk-csw-untact-untact120.js
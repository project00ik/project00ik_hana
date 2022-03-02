/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact310.js
 * 작성일 : 2021. 04. 19
 * 작성자 : 안영택
 * 설 명 : 기본정보(대표자정보입력)
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact310 = function(){
	
	return{
		
		
		// 필수값 체크하여 다음버튼활성화
		requiredValueChk : function(){
			
			if($("#resRegNoInput").val() != "" && $("#reprNmInput").val() != "" && $("#mbleNoInput").val() != "" && $("#baseAdrInput").val() != "" && $("#exAdrInput").val() != ""
			&& $("#fndsOriNSorcDvCdInput").val() != "" && $("#kycTrscPursDvCdInput").val() != ""){
				$("#nextDiv").show();
			}else{
				$("#nextDiv").hide();
			}
		},

		// 휴대폰번호와 동일
		telNoIdentical : function(){
			$("#telNoInput").parent().parent().parent().addClass("on");
			$("#telNoInput").val($("#mbleNoInput").val());
			ibk.csw.untact.untact310.requiredValueChk();
		},
		
		telCheck : function(tel){
			var regTel = /(02.{0}|^01[016789]{1}|^070.{0}|^050.{1}|^0[3-9]{1}[0-9]{1})-[0-9]{3,4}-[0-9]{4}$/;
			if(!regTel.test(tel)){
				return false;
			}
			return true;
		},
		
		reprInfoUpd : function(){
			
			var url = "";
			if(SERVER_SECTION == "dev"){
				url = "https://dev11-m.kebhana.com:18680/untact/untact_index.do?nftfChnlKindCd=MW02807A01";
			}else if(SERVER_SECTION == "stg"){
				url = "https://stg11-m.kebhana.com:18680/untact/untact_index.do?nftfChnlKindCd=MW02807A01";
			}else{
				url = "https://m.kebhana.com/untact/untact_index.do?nftfChnlKindCd=MW02807A01";
			}
			
//			hanaDialog.openAlert({title:"알림", message:"하나은행 비대면 실명확인으로 이동해 고객정보 변경합니다.<br/>고객정보 변경 후 하나원큐기업 앱을 재실행하시고 '신청결과 조회'를 통해 ‘신청중인 목록’에서 이어서 진행이 가능합니다.", fCallback1:function(){
//				window.open(url);
//				ibk.csw.common.fnAppFinish(null);
////				ibk.csw.untact.common.notFormSubmit(url);
//    		}});
			
			hanaDialog.openConfirm({title:"알림", message:"하나은행 비대면 실명확인으로 이동해 고객정보 변경합니다.<br/>고객정보 변경 후 하나원큐기업 앱을 재실행하시고 '신청결과 조회'를 통해 ‘신청중인 목록’에서 이어서 진행이 가능합니다.", 
				fCallback1:function(){
					window.open(url);
					ibk.csw.common.fnAppFinish(null);
				},
				fCallback2:function(){}
			});
			
		},
		
		requiredAlert : function(){
			if($("#resRegNoInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"대표자주민등록번호는 필수 입력 입니다."});
				return false;
			}
			if($("#reprNmInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"대표자명은 필수 입력 입니다."});
				return false;
			}
			if($("#mbleNoInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"휴대전화는 필수 입력 입니다."});
				return false;
			}
			if($("#baseAdrInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"자택 주소는 필수 입력 입니다."});
				return false;
			}
			
			if($("#extgCustYn").val() != "Y"){// 신규고객
				if($("#adrRfngYn").val() != "Y"){
					hanaDialog.openAlert({title:"알림", message:"자택 주소가 올바르지 않습니다."});
					return false;
				}
			}
			
			if(ibk.csw.untact.common.null2void($("#telNoInput").val().trim()) != ""){
				if(!ibk.csw.untact.untact310.telCheck($("#telNoInput").val())){
					hanaDialog.openAlert({title:"알림", message:"자택 전화번호가 올바른 형식이 아닙니다."});
					return false;
				}
				if($("#telNoInput").val().split("-")[1].charAt(0) == "0"){
					hanaDialog.openAlert({title:"알림", message:"올바른 자택 전화번호를 입력 해주세요."});
					return false;
				}
			}
			
			if($("#fndsOriNSorcDvCdInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"자금원천 및 출처구분은 필수 입력 입니다."});
				return false;
			}
			if($("#kycTrscPursDvCdInput").val().trim() == ""){
				hanaDialog.openAlert({title:"알림", message:"거래목적은 필수 입력 입니다."});
				return false;
			}
			return true;
		},
		
		
		untact310Submit : function(formObj){
			
			if(!ibk.csw.untact.untact310.requiredAlert()) return false;
			
			var url = "";
			if($("#dpPrdApcYn").val() == "Y"){
				url = "/untact/csuntact320.do";
			}else{
				url = "/untact/csuntact330.do";
			}
			if($("#extgNewCustDvCd").val() == "1"){
				msb.util.form.sendForm(formObj, url);
			}else{
				
				var hanaJQuery = new HanaJQuery(null, true);
				hanaJQuery.ajaxSubmit("/untact/csuntact311.do", formObj,
					function(httpRequest, textStatus){
						var data = jQuery.parseJSON(httpRequest.responseText);
						if(data.scssYn == "Y"){
							msb.util.form.sendForm(formObj, url);
						}else{
							hanaDialog.openAlert({title:"알림", message:data.errCtt});
							return false;
						}
					}
				);
			}
			
				
		},
		
		dummy : null
	};
	
}();

//# sourceURL=ibk-csw-untact-untact310.js
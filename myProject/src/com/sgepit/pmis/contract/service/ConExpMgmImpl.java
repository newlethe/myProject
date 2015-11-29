package com.sgepit.pmis.contract.service;

import java.sql.SQLException;
import java.util.Date;
import java.util.List;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.dao.ContractDAO;
import com.sgepit.pmis.contract.hbm.ConAccinfo;
import com.sgepit.pmis.contract.hbm.ConExp;
import com.sgepit.pmis.contract.hbm.ConExpkid;
import com.sgepit.pmis.contract.hbm.ConPay;

public class ConExpMgmImpl extends BaseMgmImpl implements ConExpMgmFacade {

	private ContractDAO contractDAO;

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static ConExpMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (ConExpMgmImpl) ctx.getBean("conexpMgm");
	}

	// -------------------------------------------------------------------------
	// Setter methods for dependency injection
	// -------------------------------------------------------------------------
	public void setContractDAO(ContractDAO contractDAO) {
		this.contractDAO = contractDAO;
	}

	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------
	public void insertConExp(ConExp conexp) throws SQLException, BusinessException {
		this.contractDAO.insert(conexp);
	}
	
	public void updateConexp(ConExp conexp) throws SQLException, BusinessException {
		this.contractDAO.saveOrUpdate(conexp);
	}

	public void insertConExpkid(ConExpkid conExpkid) throws SQLException, BusinessException {
		this.contractDAO.insert(conExpkid);
	}
	
	public void updateConExpkid(ConExpkid conExpkid) throws SQLException, BusinessException {
		this.contractDAO.saveOrUpdate(conExpkid);
	}
	
	public List getExpression(String conModel) throws SQLException, BusinessException{	
		//合同付款公式 屏蔽
		/*ConExp conExp = (ConExp) contractDAO.findBeanByProperty(BusinessConstants.CON_PACKAGE
				.concat(BusinessConstants.CON_EXP), "conmodel", conModel);
		List list = contractDAO.findByProperty(BusinessConstants.CON_PACKAGE
				.concat(BusinessConstants.CON_EXPKID), "expid", conExp.getExpid());
		return list;*/
		return null;
	}
	
	public Object[][] getCountInfo(String conmodel, String conid, String payid) throws SQLException, BusinessException{	
		
		//获得公式名字对应子项公式
		ConExp conexp = (ConExp) contractDAO.findBeanByProperty(BusinessConstants.CON_PACKAGE
				.concat(BusinessConstants.CON_EXP), "conmodel", conmodel);
		/*List expList = contractDAO.findByProperty(BusinessConstants.CON_PACKAGE
				.concat(BusinessConstants.CON_EXPKID), "expid", conexp.getExpid());*/
		List expList = contractDAO.findByProperty(BusinessConstants.CON_PACKAGE
				.concat(BusinessConstants.CON_EXPKID), "expid", "no_data");
		Object[][] object =  new Object[expList.size()+4][2];
		
		String where = "1=2";
		
		if(conmodel.trim().equals("合同付款")){
			
			if("".equals(payid)){
				where = "conid='"+conid+"'" ;				
			}else{
				//获得payid对应付款日期以前所有付款流水号的集合
				ConPay conpay = (ConPay)contractDAO.findById(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_PAY), payid);
				Date pay_date = conpay.getPaydate();
				String pay_date_to_string = pay_date.toString();
				where = "conid='"+conid+"' and to_char(paydate,'YYYY-MM-DD')<'"+pay_date_to_string.substring(0, 10)+"'";					
			}
		}
		if(conmodel.trim().equals("合同结算")){
			where = "conid='"+conid+"'";
		}
		
		List conPay_List = contractDAO.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_PAY), where);
		
		ConExpkid cek = new ConExpkid();
		ConPay cp = new ConPay();
		ConAccinfo ca = new ConAccinfo();
		
		double db;
		double db_true_pay = 0;//实际付款
		double db_app_pay = 0;//申请付款

		double db_true_pay_finish =0; //已处理实际付款
		double db_app_pay_finish = 0; //已处理申请付款		
		
		
		//计算累计申请付款
		for(int i=0; i<conPay_List.size(); i++){
			cp = (ConPay) conPay_List.get(i);
			double curAppmoney = cp.getAppmoney() == null ? 0.0 : cp.getAppmoney();
			double curPaymoney = cp.getPaymoney() == null ? 0.0 : cp.getPaymoney();
			db_app_pay = db_app_pay + curAppmoney;
			//已处理申请付款 已处理实际付款 未计算后面的公式加减计算 
			if(cp.getBillstate()!=null){
			if(2 == cp.getBillstate()){
				db_app_pay_finish += curAppmoney;
				db_true_pay_finish += curPaymoney;
			}}
		}
		
		object[expList.size()+1][0] = "累计申请付款";
		object[expList.size()+1][1] = db_app_pay;	
		
		object[expList.size()+2][0] = "累计已处理实际付款";
		object[expList.size()+2][1] = db_true_pay_finish;	
		
		object[expList.size()+3][0] = "累计已处理申请付款";
		object[expList.size()+3][1] = db_app_pay_finish;			
		
		db_true_pay = db_app_pay;
		
		//根据公式名称和付款流水号进行累计
		for(int i=0; i<expList.size(); i++){
			
			cek = (ConExpkid)expList.get(i);
			String expression = cek.getExpression();//公式项名称
			String expsign = cek.getExpsign();//公式项计算符号
					
			object[i][0] = "累计" + expression;	
			db = 0;
			
			for(int j=0; j<conPay_List.size(); j++){
				cp = (ConPay) conPay_List.get(j);
				where = "conid='"+conid+"' and payid='"+cp.getPayid()+"' and expression='"+expression+"'";
				List conAccinfo_List = contractDAO.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_ACCINFO), where);
				for(int k=0; k<conAccinfo_List.size(); k++){
					ca = (ConAccinfo)conAccinfo_List.get(k);
					db = db + ca.getExpvalue();
				}
			}
			
			object[i][1] = db;
			
			if(expsign.trim().equals("+")){
				db_true_pay = db_true_pay + db;
			}
			if(expsign.trim().equals("-")){
				db_true_pay = db_true_pay - db;
			}
		}	
		
		object[expList.size()][0] = "累计实际付款";
		object[expList.size()][1] = db_true_pay;			

		return object;
	}

}

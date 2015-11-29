package com.sgepit.pmis.contract.service;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Locale;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;
import org.hibernate.Hibernate;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.jspsmart.upload.SmartUploadException;
import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.sysman.hbm.AppFileinfo;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.ChineseSpelling;
import com.sgepit.frame.util.DateUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicData;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pmis.budget.hbm.BdgMonthMoneyPlan;
import com.sgepit.pmis.budget.hbm.VBdgpayapp;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.dao.ContractDAO;
import com.sgepit.pmis.contract.hbm.ConOve;
import com.sgepit.pmis.contract.hbm.ConOveView;
import com.sgepit.pmis.contract.hbm.ConPay;
import com.sgepit.pmis.contract.hbm.ConPayCharge;

public class ConPayMgmImpl extends BaseMgmImpl implements ConPayMgmFacade {
	private ContractDAO contractDAO;

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static ConPayMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (ConPayMgmImpl) ctx.getBean("conpayMgm");
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
	@SuppressWarnings("unchecked")
	public void updateConove(ConOve conove) throws SQLException,
			BusinessException {
		String str = checkValidConove(conove);
		if (!str.equals("")) {
			throw new SQLException(str);
		}
		this.contractDAO.saveOrUpdate(conove);
	}
	private String checkValidConove(ConOve conove) {
		StringBuffer msg = new StringBuffer("");
		// 合同号不允许为空
		if (conove.getConno() == null || conove.getConno().trim().equals("")) {
			msg.append(new BusinessException(
					BusinessConstants.MSG_CON_ID_IS_NULL));
			msg.append("<br>");

		}
		// 合同名称不能为空
		if (conove.getConname() == null
				|| conove.getConname().trim().equals("")) {
			msg.append(new BusinessException(
					BusinessConstants.MSG_CON_NAME_IS_NULL));
			msg.append("<br>");
		}

		String where = " pid = '" + conove.getPid() + "' and conno = '"
				+ conove.getConno() + "' and conid <> '" + conove.getConid()
				+ "'";
		List list = this.contractDAO.findByWhere(BusinessConstants.CON_PACKAGE
				.concat(BusinessConstants.CON_OVE), where);
		if (list.size() > 0) {
			msg.append(new BusinessException(
					BusinessConstants.MSG_CON_IS_NOT_UNIQUEE));
			msg.append("<br>");
		}

		return msg.toString();
	}

	@SuppressWarnings("all")
	public String insertConpay(ConPay conpay) throws SQLException,
			BusinessException {
		String state = "";
		String str = checkValidConpay(conpay);
		if (!str.equals("")) {
			state = str;
		}
		if (!checkUniqueConpay(conpay)) {
			throw new BusinessException(
					BusinessConstants.MSG_CON_IS_NOT_UNIQUEE);
		}

		Date date = conpay.getPaydate();
		if (date.toString().equals("Thu Jan 01 08:00:00 CST 1970")){
			conpay.setPaydate(null);
		}
		String idTemp = this.contractDAO.insert(conpay);
		this.contractDAO.insert(conpay);
		PcDynamicData  pdd= new PcDynamicData();
		pdd.setPcdynamicdate(new Date());
		pdd.setPctablebean(ConPay.class.getName());
		pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(ConPay.class.getName()));
		pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
		pdd.setPctableuids(conpay.getPayid());
		pdd.setPcurl(DynamicDataUtil.CON_PAY_URL);
		pdd.setPid(conpay.getPid());
		String sql="update con_pay_charge con set con.payid='"+conpay.getPayid()+"' where con.payid is null and con.pid='"+conpay.getPid()+"' and con.conid='"+conpay.getConid()+"'";
		contractDAO.updateBySQL(sql);
		this.contractDAO.insert(pdd);
		
		if(conpay.getFundsPlanId()!=null && conpay.getFundsPlanId().length()>0){
			BdgMonthMoneyPlan bdgMonth = (BdgMonthMoneyPlan) contractDAO.findById(BdgMonthMoneyPlan.class.getName(), conpay.getFundsPlanId());
			if(bdgMonth!=null){
				bdgMonth.setBillState("1");
				contractDAO.saveOrUpdate(bdgMonth);
			}
		}
		ConOve  con = (ConOve) contractDAO.findById(ConOve.class.getName(), conpay.getConid());
		con.setBillstate(2l);
		contractDAO.saveOrUpdate(con);
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			List  conList = new ArrayList();
			conList.add(conpay);
			conList.add(pdd);
			conList.add(con);
			PCDataExchangeService dataExchangeService =
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			//更改为合同执行
			List ExchangeList = dataExchangeService.getExcDataList(conList, Constant.DefaultOrgRootID,conpay.getPid(),"",sql,"合同付款新增");
			dataExchangeService.addExchangeListToQueue(ExchangeList);
		}
		return state;
	}

	@SuppressWarnings("unchecked")
	public String updateConpay(ConPay conpay) throws SQLException,
			BusinessException {
		String state = "";
		String str = checkValidConpay(conpay);
		if (!str.equals("")) {
			state = str;
		}
		Date date = conpay.getPaydate();
		if (date.toString().equals("Thu Jan 01 08:00:00 CST 1970")){
			conpay.setPaydate(null);
		}
		this.contractDAO.saveOrUpdate(conpay);
		PcDynamicData  pdd= new PcDynamicData();
		pdd.setPcdynamicdate(new Date());
		pdd.setPctablebean(ConPay.class.getName());
		pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(ConPay.class.getName()));
		pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
		pdd.setPctableuids(conpay.getPayid());
		pdd.setPcurl(DynamicDataUtil.CON_PAY_URL);
		pdd.setPid(conpay.getPid());
		this.contractDAO.insert(pdd);
		List conList = new ArrayList();
		conList.add(conpay);
		conList.add(pdd);
		String conid = conpay.getConid();
		ConOve tmpVO = (ConOve) contractDAO
				.findById(BusinessConstants.CON_PACKAGE
						.concat(BusinessConstants.CON_OVE), conid);
		if(tmpVO!=null){
			tmpVO.setBillstate(2l);
			//计算付款比例
			this.updateConove(tmpVO);
			conList.add(tmpVO);
		}
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(conList, Constant.DefaultOrgRootID,conpay.getPid(),"","","修改合同付款信息");
			dataExchangeService.addExchangeListToQueue(ExchangeList);		
		}
		return state;
	}

	private String checkValidConpay(ConPay conpay) {
		StringBuffer msg = new StringBuffer("");
		// 项目编号不能为空
		if (conpay.getPid() == null || conpay.getPid().trim().equals("")) {
			msg
					.append(new BusinessException(
							BusinessConstants.MSG_PID_IS_NULL));
			msg.append("<br>");

		}
		// 检查数据是否唯一
		String where = " pid = '" + conpay.getPid() + "' and payid='"
				+ conpay.getPayid() + "'  and conid <> '" + conpay.getConid()
				+ "'";
		;
		List list = this.contractDAO.findByWhere(BusinessConstants.CON_PACKAGE
				.concat(BusinessConstants.CON_PAY), where);
		if (list.size() > 0) {
			msg.append(new BusinessException(
					BusinessConstants.MSG_CON_IS_NOT_UNIQUEE));
			msg.append("<br>");
		}
		return msg.toString();
	}

	private boolean checkUniqueConpay(ConPay conpay) {
		String where = " pid = '" + conpay.getPid() + "' and payid='"
				+ conpay.getPayid() + "'";
		List list = this.contractDAO.findByWhere(BusinessConstants.CON_PACKAGE
				.concat(BusinessConstants.CON_PAY), where);
		if (list.size() > 0) {
			return false;
		}
		return true;
	}

	@SuppressWarnings("unchecked")
	public String deleteConpay(String payid,String modId) {
		String flag = "0";
		String beanName = BusinessConstants.CON_PACKAGE
				+ BusinessConstants.CON_PAY;
		try {
			ConPay conpay = (ConPay) this.contractDAO.findById(beanName, payid);
			String bean = BusinessConstants.BDG_PACKAGE
					+ BusinessConstants.BDG_PAY_APP;
			List bdgPay_list = this.contractDAO.findByProperty(bean, "payappno",
					payid);
			if (bdgPay_list != null && bdgPay_list.size() > 0) {
				return flag = "已存在概算付款记录，不能删除！";
			}
			HttpSession  session =WebContextFactory.get().getSession();
			String pid=(String)session.getAttribute(Constant.CURRENTAPPPID);
			 SystemMgmFacade systemMgmFacade  =(SystemMgmFacade)Constant.wact.getBean("systemMgm");
			 String rtn=systemMgmFacade.getFlowType(pid, modId);
			 if("BusinessProcess".equals(rtn)&&conpay.getBillstate()!=0){
				 return "流程审批中的合同付款不能删除";
			 }
			this.contractDAO.delete(conpay);
			
			List conList = new ArrayList();
			conList.add(conpay);
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(conList, Constant.DefaultOrgRootID,conpay.getPid(),"","","删除合同付款");
				dataExchangeService.addExchangeListToQueue(ExchangeList);			
			}
		} catch (RuntimeException e) {
			flag = "1";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}

	/**
	 * 检查所有付款是否为合同签订金额的90%
	 * 
	 * @author codeix
	 * @param conid
	 * @return
	 */
	public int percentCheck(String conid) {
		int msg = -1;
		// 得到合同签订金额
		ConOveView conove = (ConOveView) contractDAO
				.findBeanByProperty(ConOveView.class.getName(), "conid", conid);
		if (conove == null) {
			return -1;
		}
		Double conmoney = conove.getConvaluemoney();
		if (conmoney == null||conmoney==0d) {
			return -1;
		}
		Double db = new Double("0");
        db=conove.getConpay();
		db = db / conmoney;
		if (db > 0.9) {
			msg = 1;
		}
		if (db < 0.9) {
			msg = 0;
		}
		return msg;
	}

	@SuppressWarnings("unchecked")
	public String payPercent(String conid) {
		StringBuilder strPercent = new StringBuilder();
		
		ConOveView conove = (ConOveView) contractDAO
				.findBeanByProperty(ConOveView.class.getName(), "conid", conid);
		
		Double conmoney = conove.getConvaluemoney();
		
		List<ConPay> list = this.contractDAO
				.findByWhere(BusinessConstants.CON_PACKAGE
						.concat(BusinessConstants.CON_PAY), "conid='"+conid+"' and billstate=1" );
		for (int i = 0; i < list.size(); i++) {
			Double paymoney = list.get(i).getPaymoney();
			if ( paymoney == null ){
				paymoney = 0.0;
				if(conmoney==0.0){
					strPercent.append("0.00%");
				}else {
					double res=paymoney / conmoney;
					NumberFormat numberFormat=NumberFormat.getPercentInstance();
					numberFormat.setMaximumFractionDigits(2);
					numberFormat.setMinimumFractionDigits(2);
					strPercent.append(numberFormat.format(res));
				}
			}
			if (i != list.size()-1) strPercent.append("+");
		}
		return strPercent.toString();
	}
	/*
	 * 自动生成付款编码
	 *  Author:  lixiaob
	 */

	public String AutoPayNo(String username,String userid){
		String payno=null;
		ChineseSpelling spell=new ChineseSpelling();
		Calendar   cal=new   GregorianCalendar();   
		int   year= cal.get(Calendar.YEAR);                            
        int   month=cal.get(Calendar.MONTH)+1;                       
        String y = String.valueOf(year); 
        String m = String.valueOf(month); 
        String maxnum=null;    //该列表中最大的序列

        String sql = "select max(substr(PAYNO,-3)) from CON_PAY where payno like '"+y+m+"%' ";
        JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
        
        maxnum=(String)jdbc.queryForObject(sql, String.class);
        if(maxnum==null){
        	payno=y+m+"001";
        }else{
        	NumberFormat numformat = NumberFormat.getInstance(Locale.CHINESE);
        	numformat.setMinimumIntegerDigits(3);
        	payno=y+m+numformat.format(Integer.valueOf(maxnum)+1);
        }
               
        return payno;
	}
	
	//获得合同查询里面的已付金额  和 处理中金额
	public Object[] getMoneyMessage(String conid){
		Double alreadyMoney = new Double(0);
		Double processMoney = new Double(0);
		Double invoiceMoney = new Double(0);
		String beanName = BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_PAY);
		List listAlready = this.contractDAO.findByWhere(beanName, "conid = '"+ conid +"' and billstate = 1");
		List listProcess = this.contractDAO.findByWhere(beanName, "conid = '"+ conid +"' and (billstate <> 1)");
		for(int i=0;i<listAlready.size();i++){ 
			ConPay pay1 = (ConPay) listAlready.get(i);
			alreadyMoney += pay1.getPaymoney();
			if(pay1.getInvoicemoney()!=null){
				invoiceMoney += pay1.getInvoicemoney();	
			}		
		}
		for(int i=0;i<listProcess.size();i++){
			ConPay pay2 = (ConPay) listProcess.get(i);
			Double appMoney = pay2.getAppmoney() == null ? 0.0 : pay2.getAppmoney();
			processMoney += appMoney;
		}	
		return new Object[]{alreadyMoney,processMoney,invoiceMoney};
	}

	@SuppressWarnings("all")
	public void addDataChangeToDel(String ids, String beanName) {
         List list = new ArrayList();
         if(ids!=null&&!"".equals(ids)){
        	 String[] Ids=ids.split(",");
        	 for(int i=0;i<Ids.length;i++){
        		 ConPayCharge  charge = new ConPayCharge();
        		 charge.setUids(Ids[i]);
        		 list.add(charge);
        	 }
         }
         if(!list.isEmpty()){
			   //查寻是否有数据交互的PID
			   if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				   PCDataExchangeService dataExchangeService = 
					   (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				   List ExchangeList = dataExchangeService.getExchangeDataList(list,Constant.DefaultOrgRootID, "删除扣款记录");
				   dataExchangeService.addExchangeListToQueue(ExchangeList);				
			   }        	 
         }
	}

	@SuppressWarnings("all")
	public void addDataChangeToSave(String insertIds, String updateids,
			String beanName) {
            List list = new ArrayList();
            if(insertIds!=null&&!"".equals(insertIds)){
            	String ids[]=insertIds.split(",");
            	for(int i=0;i<ids.length;i++){
            		ConPayCharge charge = new ConPayCharge();
            		charge.setUids(ids[i]);
            		list.add(charge);
            	}
            }
            if(updateids!=null&&!"".equals(updateids)){
            	String[] upids =updateids.split(",");
            	for(int k=0;k<upids.length;k++){
            		ConPayCharge charge = new ConPayCharge();
            		charge.setUids(upids[k]);
            		list.add(charge);
            	}
            }
            if(!list.isEmpty()){
 			   //查寻是否有数据交互的PID
 			   if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
 				   PCDataExchangeService dataExchangeService = 
 					   (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
 				   List ExchangeList = dataExchangeService.getExchangeDataList(list,Constant.DefaultOrgRootID, "新增修改扣款记录");
 				   dataExchangeService.addExchangeListToQueue(ExchangeList);				
 			   }               	
            }
	}

	@SuppressWarnings("unchecked")
	public Double getApplyMoneyFromBdgProject(String conid, String pid) {
		String sql=" select nvl(sum(nvl(pro.decmoney,0)),0) from pro_acm_month  pro where pro.conid='"+conid+"' and pro.pid='"+pid+"'";
		List list =contractDAO.getDataAutoCloseSes(sql);
		if(list.size()>0){
			return ((BigDecimal)list.get(0)).doubleValue();
		}
		return 0d;
	}
	/***
	 * 获取付款分摊实际金额
	 * @param conid
	 * @param parent
	  * @param payid
	 * @return
	 */		
	public Double getFactpaymoney(String conid, String parent, String payid){
		String str = "parent = '" + parent + "' and conid = '" + conid + "' and payappno = '" + payid + "' order by bdgid";
		List<VBdgpayapp> objects = this.contractDAO.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgpayapp"), str);
		Double factpaymoney=0.0;
		if(objects!=null&&objects.size()>0){
			VBdgpayapp vbpa=objects.get(0);
			factpaymoney=vbpa.getFactpay();
			}
		return factpaymoney;
	}
	/***
	 *获取项目本月合同付款信息与累计合同付款信息
	 * @param sj
	 * @param params
	 * @return
	 */	
	public List findPcBusinessConPay(String sj, String params) {
		Session s = null;
		List l = null;	
		int size = 0;
		String sql="select *from con_pay c where  "+params+"";
			if(sj!=""){
				sql="select * from  con_pay c where to_char(c.paydate,'yyyyMM')='"+sj+"' and "+params+"";
			}				
		try {
			s = HibernateSessionFactory.getSession();
			SQLQuery q = s.createSQLQuery(sql)
			.addScalar("payid", Hibernate.STRING)
			.addScalar("pid", Hibernate.STRING)
			.addScalar("conid", Hibernate.STRING)
			.addScalar("payno", Hibernate.STRING)
			.addScalar("paydate", Hibernate.DATE)
			.addScalar("appmoney", Hibernate.DOUBLE)
			.addScalar("passmoney", Hibernate.DOUBLE)
			.addScalar("demoney", Hibernate.DOUBLE)
			.addScalar("planmoney", Hibernate.DOUBLE)
			.addScalar("paymoney", Hibernate.DOUBLE)
			.addScalar("paytype", Hibernate.STRING)
			.addScalar("remark", Hibernate.STRING)
			.addScalar("billstate", Hibernate.LONG)
			.addScalar("actman", Hibernate.STRING)
			.addScalar("payins", Hibernate.STRING)
			.addScalar("filelsh", Hibernate.STRING)
			.addScalar("invoicemoney", Hibernate.DOUBLE)
			.addScalar("paymentno", Hibernate.STRING)
			.addScalar("invoicerecord", Hibernate.STRING);
			size = q.list().size();
			q.setFirstResult(0);
			q.setMaxResults(size);
			l = q.list();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			s.close();
			}	
		List returnList = new ArrayList();		
		if(size>0){
			for (int i = 0; i <l.size(); i++) {
				ConPay conPay=new ConPay();
				Object[] objs = (Object[]) l.get(i);
				conPay.setPayid((String)objs[0]);
				conPay.setPid((String)objs[1]);
				conPay.setConid((String)objs[2]);
				conPay.setPayno((String)objs[3]);
				conPay.setPaydate((Date)objs[4]);
				conPay.setAppmoney((Double)objs[5]);
				conPay.setPassmoney((Double)objs[6]);
				conPay.setDemoney((Double)objs[7]);
				conPay.setPlanmoney((Double)objs[8]);
				conPay.setPaymoney((Double)objs[9]);
				conPay.setPaytype((String)objs[10]);
				conPay.setRemark((String)objs[11]);
				conPay.setBillstate((Long)objs[12]);
				conPay.setActman((String)objs[13]);
				conPay.setPayins((String)objs[14]);
				conPay.setFilelsh((String)objs[15]);
				conPay.setInvoicemoney((Double)objs[16]);
				conPay.setPaymentno((String)objs[17]);
				conPay.setInvoicerecord((String)objs[18]);
				returnList.add(conPay);
			}
		}
		returnList.add(size);
		return returnList;
	}

	/**
	 * 保存付款申请单、增值税专用发票收具单
	 * @param uids 合同付款主键payid
	 * @param fieldname 字段名：applyFileid、invoiceFileid
	 * @param fileid 文档id
	 * @param hasfile 是否已经存在文档
	 * @param myFile 文档对象
	 * @return 保存信息
	 * @author pengy 2013-12-03
	 */
	public String saveOrUpdateBlob(String uids, String fieldname, String fileid,
			String hasfile, com.jspsmart.upload.File myFile){
		boolean isNew = true;//是否新增
		StringBuilder msg = null;//返回的消息串
		String filename = myFile.getFileName();
		int file_size = myFile.getSize();
		String uploadTempFolder = Constant.AppRootDir.concat(Constant.TEMPFOLDER);
		java.io.File file = new java.io.File(uploadTempFolder.concat("/") + filename);
		try {
			myFile.saveAs(file.getAbsolutePath(), 2);
		} catch (IOException e1) {
			e1.printStackTrace();
		} catch (SmartUploadException e1) {
			e1.printStackTrace();
		}
		if(hasfile.equals("true")){
			//hasfile为true:表示主记录中fileid有值，附件已经生成过，保存直接更新当前附件，updateBlob中进行更新文档
			isNew = false;
		}else{
			//hasfile为false:表示主记录中fileid没有值，附件直接使用模板，由模板保存新附件，updateBlob中进行新增文档
			String compressed = "zip,rar,gz".indexOf(filename.substring(
					filename.lastIndexOf(".") + 1).toLowerCase()) > -1 ? "1" : "0";
			AppFileinfo fileinfo = new AppFileinfo(filename,
					Constant.FILESOURCE, myFile.getContentType(), compressed,
					DateUtil.getSystemDateTime(), Long.parseLong(file_size+""),"");
			fileid = this.contractDAO.insert(fileinfo); 
		}
		try {
			this.contractDAO.updateBlob(fileid, new FileInputStream(file), file_size, isNew);
		} catch (SQLException e) {
			e.printStackTrace();
			msg = new StringBuilder();
			msg.append("文件另存为失败！<br>");
			msg.append("错误原因：");
			msg.append((new StringBuilder("&nbsp;&nbsp;")).append(e.getMessage()).toString());
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		//更新业务数据主记录中的fileid
		this.contractDAO.updateBySQL("UPDATE CON_PAY SET " + fieldname + "='" + fileid + "' WHERE PAYID = '" + uids + "'");

		msg = new StringBuilder();
		msg.append("保存成功！ ");
		msg.append((new StringBuilder("在线编辑的文件: 《")).append(filename) .append("》  ").toString());
		msg.append((new StringBuilder("大小: ")).append(file_size).append(" bytes").toString());
		file.delete();
		return msg.toString();
	}

}

package com.sgepit.pcmis.zhxx.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.hibernate.Session;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.FileManagementService;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.pcmis.approvl.hbm.VPcPwPrjInfo;
import com.sgepit.pcmis.aqgk.hbm.PcAqgkAccidenrInfo;
import com.sgepit.pcmis.bid.service.PCBidApplyService;
import com.sgepit.pcmis.bid.service.PCBidApplyServiceImpl;
import com.sgepit.pcmis.budget.service.PCBdgInfoService;
import com.sgepit.pcmis.budget.service.PCBdgInfoServiceImpl;
import com.sgepit.pcmis.contract.service.PCContractService;
import com.sgepit.pcmis.contract.service.PCContractServiceImpl;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicData;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicIndex;
import com.sgepit.pcmis.dynamicview.service.PcDynamicDataService;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pcmis.jdgk.hbm.PcJdgkWeekWork;
import com.sgepit.pcmis.jdgk.hbm.PcJdgkWeekWorkList;
import com.sgepit.pcmis.tzgl.hbm.VPcTzglYearPlanReport;
import com.sgepit.pcmis.zhxx.dao.ZhxxDAO;
import com.sgepit.pcmis.zhxx.hbm.PcProBaseInfoD;
import com.sgepit.pcmis.zhxx.hbm.PcProBaseInfoM;
import com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjFundsrc;
import com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo;
import com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjKeyMan;
import com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjPartner;
import com.sgepit.pcmis.zhxx.hbm.PcZhxxProIndex;
import com.sgepit.pcmis.zhxx.hbm.PcZhxxQianqPrjInfo;
import com.sgepit.pcmis.zhxx.hbm.SgccUnitModule;
import com.sgepit.pcmis.zhxx.hbm.VPcZhxxPrjInfo;
import com.sgepit.pcmis.zlgk.service.PCZlgkService;
import com.sgepit.pcmis.zlgk.service.PCZlgkServiceImpl;

public class PCPrjBaseInfoServiceImpl implements PCPrjBaseInfoService {
	private String CMLPATH;//flex配置文件路径
	private ZhxxDAO zhxxDAO;
	private PCBidApplyService pcBidApplyService;
	private PCBdgInfoService pcBdgInfoMgm;
	private PCContractService pcConMgm;
	private PCZlgkService zlgkImpl;
	private PcDynamicDataService pcDynamicDataService;
	
	public PCPrjBaseInfoServiceImpl(){
		CMLPATH = Constant.AppRootDir.concat("PCBusiness/cml/");
	}
	
	public ZhxxDAO getZhxxDAO() {
		return zhxxDAO;
	}

	public void setZhxxDAO(ZhxxDAO zhxxDAO) {
		this.zhxxDAO = zhxxDAO;
	}
	public static PCPrjBaseInfoServiceImpl getFromApplicationContext(ApplicationContext ctx) {
		return (PCPrjBaseInfoServiceImpl) ctx.getBean("pcPrjServiceImpl");
	}

	public static PCBidApplyServiceImpl getPcBidApplyService(ApplicationContext ctx) {
		return (PCBidApplyServiceImpl)ctx.getBean("pcBidApplyService");
	}

	public void setPcBidApplyService(PCBidApplyService pcBidApplyService) {
		this.pcBidApplyService = pcBidApplyService;
	}
   
	public void setPcBdgInfoMgm(PCBdgInfoService pcBdgInfoMgm) {
		this.pcBdgInfoMgm = pcBdgInfoMgm;
	}
	public static PCBdgInfoServiceImpl getPcBdgInfoMgm(ApplicationContext ctx) {
		return (PCBdgInfoServiceImpl)ctx.getBean("pcBdgInfoMgm");
	}
	
	public static PCContractServiceImpl getPcConMgm(ApplicationContext ctx) {
		return (PCContractServiceImpl) ctx.getBean("pcConMgm");
	}

	public void setPcConMgm(PCContractService pcConMgm) {
		this.pcConMgm = pcConMgm;
	}

	public PCZlgkServiceImpl getZlgkImpl(ApplicationContext ctx) {
		return (PCZlgkServiceImpl)ctx.getBean("zlgkImpl");
	}

	public void setZlgkImpl(PCZlgkService zlgkImpl) {
		this.zlgkImpl = zlgkImpl;
	}
	
	public PcDynamicDataService pcDynamicDataService(ApplicationContext ctx) {
		return (PcDynamicDataService)ctx.getBean("pcDynamicDataService");
	}

	public void setPcDynamicDataService(PcDynamicDataService pcDynamicDataService) {
		this.pcDynamicDataService = pcDynamicDataService;
	}

	/**
	 * 项目基本信息添加和修改
	 */
	public String addOrUpdate(PcZhxxPrjInfo prj){
		SgccIniUnit unitPrj=null;
		String flag = "0";
		try{
			 unitPrj = (SgccIniUnit) zhxxDAO.findBeanByProperty(SgccIniUnit.class.getName(), 
					"unitid", prj.getPid());
			 if(unitPrj==null){
				 unitPrj = new SgccIniUnit();
				 unitPrj.setUnitid(prj.getPid());
				 unitPrj.setUnitname(prj.getPrjName());
				 unitPrj.setUpunit(prj.getMemoC1());
				 unitPrj.setUnitTypeId("A");
				 unitPrj.setLeaf(1);
				 unitPrj.setViewOrderNum(1);
				 zhxxDAO.insert(unitPrj);
			 }else{
				 unitPrj.setUpunit(prj.getMemoC1());
				 unitPrj.setUnitid(prj.getPid());
				 unitPrj.setUnitname(prj.getPrjName());
				 zhxxDAO.saveOrUpdate(unitPrj);
			 }
			 //更新上级单位节点的leaf属性
			 SgccIniUnit unitHbm = (SgccIniUnit) zhxxDAO.findBeanByProperty(SgccIniUnit.class.getName(),"unitid", prj.getMemoC1());
			 unitHbm.setLeaf(new Integer(0));
			 zhxxDAO.saveOrUpdate(unitHbm);
			 
			if("".equals(prj.getUids())||prj.getUids()==null){//新增
				this.zhxxDAO.insert(prj);
				
				flag="1";
			}else{//修改
				this.zhxxDAO.saveOrUpdate(prj);
				PcDynamicData dyda=new PcDynamicData();
				dyda.setPid(prj.getPid());
				dyda.setPctablebean(PcZhxxPrjInfo.class.getName());
				dyda.setPctablename(DynamicDataUtil.getTableNameByEntry(PcZhxxPrjInfo.class.getName()));
				dyda.setPctableoptype(DynamicDataUtil.OP_UPDATE);
				dyda.setPctableuids(prj.getUids());
				dyda.setPcdynamicdate(new Date());
				dyda.setPcurl(DynamicDataUtil.PROJECT_INFO_URL);
				zhxxDAO.insert(dyda);
				flag = "2";
				//数据交互
				sendPrjInfoToMIS(prj.getPid(),dyda.getUids());
			}
			
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}
	
	
	/**
	 * 前期项目基本信息首先判断编号是否已经被使用, 然后再做保存或者是修改
	 * 0---编码已被使用
	 * 1---新增前期项目成功
	 * 2---修改前期项目成功
	 * -1----异常, 操作失败
	 */
	public String addOrUpdatePre(PcZhxxQianqPrjInfo prj){
		String flag = "0";
		String pid = prj.getPid();
		String uids = prj.getUids();
		try{
			List<VPcPwPrjInfo> vPrjInfo = 
					zhxxDAO.findByWhere2(com.sgepit.pcmis.approvl.hbm.VPcPwPrjInfo.class.getName(),"pid='"+pid+"'");
			//找不到pid的记录, 新增或者修改都可以进行
			if(vPrjInfo.isEmpty())
			{
				if("".equals(prj.getUids())||prj.getUids()==null) //新增
				{
					this.zhxxDAO.insert(prj);
					flag="1";
				}
				else                                             //修改
				{
					this.zhxxDAO.saveOrUpdate(prj);
					flag = "2";
				} 
			}
			else
			//找到pid的记录, 新增和修改区别对待	
			{
				VPcPwPrjInfo prjHbm = vPrjInfo.get(0);
				if("".equals(prj.getUids())||prj.getUids()==null) //新增
				{
					flag = "0";
				}
				else                                             //修改
				{
					//判断主键是否相等, 如果相等修改成功, 如果不相等报告编号已经被使用
					if(prjHbm.getUids().equals(prj.getUids()))
					{
						this.zhxxDAO.saveOrUpdate(prj);
						flag = "2";
					}
					else
					{
						flag = "0";
					}
				} 
			}
		}catch(Exception e){
			flag = "-1";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}
	

	
	/**
	 * 验证项目编号(pid)的唯一性,如果无重复返回“0”,否则返回“1”
	 */
	
	public String isUnique(String temp) throws SQLException, BusinessException{
		String sql="select pid from pc_zhxx_prj_info where pid='"+temp+"'";
		List<Map> list=JdbcUtil.query(sql);
		String flag="0";
		if(!list.isEmpty()){
			flag="1";
		}
		return flag;

	}
	
	/**
	 * 项目主要人员添加和修改
	 */
	public String keymanAddOrUpdate(PcZhxxPrjKeyMan keyman) {
		String flag = "0";
		try{
			if(keyman.getImage()!=null){
				if(zhxxDAO.getDataAutoCloseSes("select fileid from app_blob " +
						"where fileid='"+keyman.getImage()+"'").size()==0){
					keyman.setImage(null);
				}
			}
			if("".equals(keyman.getUids())||keyman.getUids()==null){//新增
				this.zhxxDAO.insert(keyman);
				flag=keyman.getUids();
			}else{//修改
				this.zhxxDAO.saveOrUpdate(keyman);
				flag=keyman.getUids();
			}
			
			sendKeymanToJT(keyman.getUids(),Constant.DefaultOrgRootID);
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}
	/**
	 * MIS定时上报主要人员信息。针对 新增 和 修改
	 * @param pid
	 * @modify by liangwj at 2011-10-31 (1.判断是否需要数据交互 2.如果需要数据交互需要加入发送单位)
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void sendKeymanToJT(String uids, String pid){
		PcZhxxPrjKeyMan keymanHbm = (PcZhxxPrjKeyMan) zhxxDAO.findById(PcZhxxPrjKeyMan.class.getName(), uids);
		//Constant.propsMap.put("DEPLOY_UNITTYPE","A");
		if(keymanHbm!=null&&Constant.propsMap.get("DEPLOY_UNITTYPE")!=null&&
				Constant.propsMap.get("DEPLOY_UNITTYPE").equals("A")){
			PCDataExchangeService exchangeServiceImp = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			//获取数据交换对象列表(参数说明：带报送数据，接收单位，发送单位，前置sql，后置sql，业务说明)
			PcDataExchange excKeyMan = exchangeServiceImp.getExcData(keymanHbm,pid,
					keymanHbm.getPid(),null,null,"项目主要人员编辑【"+keymanHbm.getPid()+"】");
			List<PcDataExchange> exchangeList=new ArrayList<PcDataExchange>();
			exchangeList.add(excKeyMan);
			if(keymanHbm.getImage()==""){
				JSONArray kvarr = new JSONArray();
				JSONObject kv = new JSONObject();
				kv.put("FILEID", keymanHbm.getImage());
				kvarr.add(kv);
				
				PcDataExchange excImage = new PcDataExchange();
				excImage.setTableName("APP_BLOB");//设置表名
				excImage.setBlobCol("BLOB");//设置大对象列名
				excImage.setKeyValue(kvarr.toString());//设置主键
				excImage.setSuccessFlag("0");
				excImage.setXh(excKeyMan.getXh() + 1);//手动设置pid，排序号，事务编号，需要和已有的交换数据列表统一
				excImage.setPid(pid);//接收单位
				excImage.setSpareC5(keymanHbm.getPid());//发送单位
				excImage.setTxGroup(excKeyMan.getTxGroup());
				excImage.setBizInfo("项目主要人员编辑【"+keymanHbm.getPid()+"】");
				exchangeList.add(excImage);
			}
			
			
			exchangeServiceImp.addExchangeListToQueue(exchangeList);
		}
	}
	/**
	 * MIS定时上报主要人员信息。针对删除功能。
	 * @param ids 主键
	 * @param imagesId 图片信息
	 * @param fromunit 发送单位
	 * @param tounit 接收单位
	 * @modify by liangwj at 2011-10-31 (1.判断是否需要数据交互 2.如果需要数据交互需要加入发送单位)
	 */
	public void sendKeymanToJTDEL(String ids, String imagesId, String fromunit,String tounit){
		if(Constant.propsMap.get("DEPLOY_UNITTYPE")!=null&&
				Constant.propsMap.get("DEPLOY_UNITTYPE").equals("A")){
			
			PCDataExchangeService exchangeServiceImp = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");

			String[] id=ids.split(",");
			String[] imageId=imagesId.split(",");
			
			List<PcZhxxPrjKeyMan> keymanList = new ArrayList<PcZhxxPrjKeyMan>();
			for(int i=0; i<id.length;i++){
				PcZhxxPrjKeyMan keyman=new PcZhxxPrjKeyMan();
				keyman.setUids(id[i]);
				keymanList.add(keyman);
			}
			List<PcDataExchange> exchangeList = exchangeServiceImp.getExcDataList(keymanList,tounit,fromunit,
					null,null,"项目主要人员删除【"+fromunit+"】");

			PcDataExchange tempExc = exchangeList.get(exchangeList.size() - 1);
			Long curXh = tempExc.getXh();
			String curTxGroup = tempExc.getTxGroup();
			
			for(int j=0; j<imageId.length;j++){
				JSONArray kvarr = new JSONArray();
				JSONObject kv = new JSONObject();
				String[] temp=imageId[j].split(":");
				for(int i=0;i<id.length;i++){
					if(temp[0].equals(id[i])&&temp.length>1){
						kv.put("FILEID", temp[1]);
						break;
					}
				}
				kvarr.add(kv);

				PcDataExchange exchange = new PcDataExchange();
				exchange.setTableName("APP_BLOB");
				exchange.setBlobCol("BLOB");
				exchange.setKeyValue(kvarr.toString());
				exchange.setSuccessFlag("0");
				exchange.setXh(++curXh);
				exchange.setPid(tounit);
				exchange.setSpareC5(fromunit);
				exchange.setBizInfo("项目主要人员删除【"+fromunit+"】");
				exchange.setTxGroup(curTxGroup);
				
				exchangeList.add(exchange);
			}
			exchangeServiceImp.addExchangeListToQueue(exchangeList);
		}
	}
	/**
	 * 将项目基本信息的变更实时交互到集团或者项目单位。针对 修改 功能
	 * @param pid
	 * @modify by liangwj at 2011-10-31 带报送队列中加入发送单位
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void sendPrjInfoToMIS(String pid,String dydaUids){
		//获取组织机构中更改的bean
		SgccIniUnit unitHbm=(SgccIniUnit) zhxxDAO.findBeanByProperty(SgccIniUnit.class.getName(), 
				"unitid", pid);
		if(unitHbm!=null&&unitHbm.getAppUrl()!=null&&!(unitHbm.getAppUrl().equals(""))){
			//获取项目基本信息中更改的bean
			PcZhxxPrjInfo prjHbm = (PcZhxxPrjInfo) zhxxDAO.findBeanByProperty(PcZhxxPrjInfo.class.getName(), 
					"pid", pid);
			if(prjHbm!=null){
				//将要传输的所有实体bean存放到一个List中，使得返回的PcDataExchange对象集合都属于同一事务
				List allDataList=new ArrayList();
				allDataList.add(prjHbm);
				allDataList.add(unitHbm);
				
				//获取PCDataExchangeService实例
				PCDataExchangeService exchangeServiceImp = (PCDataExchangeService) 
								Constant.wact.getBean("PCDataExchangeService");
				//获取数据交换对象列表(参数说明：带报送数据，接收单位，发送单位，前置sql，后置sql，业务说明)
				String deployUnitType=Constant.propsMap.get("DEPLOY_UNITTYPE");
				List<PcDataExchange> exchangeList=null;
				if(deployUnitType.equals("0")){
					exchangeList = exchangeServiceImp.getExcDataList(allDataList,pid,Constant.DefaultOrgRootID,
							null,null,"集团->项目单位 项目基本信息编辑【"+pid+"】");
				}else{
					PcDynamicData dyda=(PcDynamicData)zhxxDAO.findBeanByProperty(PcDynamicData.class.getName(),"uids",dydaUids);
					allDataList.add(dyda);
					exchangeList = exchangeServiceImp.getExcDataList(allDataList,Constant.DefaultOrgRootID,pid,
							null,null,"项目单位->集团 项目基本信息编辑【"+pid+"】");
				}
				//实时数据交互
				Map rtnmap = exchangeServiceImp.sendExchangeData(exchangeList);
				if(!(rtnmap.get("result").equals("success"))){//如果发送失败则加入到队列
					exchangeServiceImp.addExchangeListToQueue(exchangeList);
				}
			}
		}
	}
	/**
	 * 数据交互（项目单位->集团），项目主要合作单位新增或编辑
	 * @param idsOfInsert 新增记录id
	 * @param idsOfUpdate 修改记录id
	 * @param fromunit 发送 单位
	 * @param tounit   接收单位
	 * @author liangwj
	 * @since 2011-10-31
	 */
	@SuppressWarnings("unchecked")
	public String sendCoUnitToJT(String idsOfInsert, String idsOfUpdate,String fromunit,String tounit){
		//首先判断是否需要数据交互
		String dType = Constant.propsMap.get("DEPLOY_UNITTYPE")==null?"0":Constant.propsMap.get("DEPLOY_UNITTYPE");
			List objList=new ArrayList();
			String [] idsInser=idsOfInsert.split(",");
			for(int i=0;i<idsInser.length;i++){
				PcZhxxPrjPartner coUnit=(PcZhxxPrjPartner)zhxxDAO.findBeanByProperty(PcZhxxPrjPartner.class.getName(), "uids", idsInser[i]);
				if(coUnit!=null){
					PcDynamicData dyda=new PcDynamicData();
					dyda.setPid(fromunit);
					dyda.setPctablebean(PcZhxxPrjPartner.class.getName());
					dyda.setPctablename(DynamicDataUtil.getTableNameByEntry(PcZhxxPrjPartner.class.getName()));
					dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
					dyda.setPctableuids(coUnit.getUids());
					dyda.setPcdynamicdate(new Date());
					dyda.setPcurl(DynamicDataUtil.PROJECT_PARTNER_URL);
					zhxxDAO.insert(dyda);
					objList.add(coUnit);
					objList.add(dyda);
				}
			}
			String [] idsUpd=idsOfUpdate.split(",");
			for(int i=0;i<idsUpd.length;i++){
				PcZhxxPrjPartner coUnit=(PcZhxxPrjPartner)zhxxDAO.findBeanByProperty(PcZhxxPrjPartner.class.getName(), "uids", idsUpd[i]);
				if(coUnit!=null){
					objList.add(coUnit);
					PcDynamicData dyda=new PcDynamicData();
					dyda.setPid(fromunit);
					dyda.setPctablebean(PcZhxxPrjPartner.class.getName());
					dyda.setPctablename(DynamicDataUtil.getTableNameByEntry(PcZhxxPrjPartner.class.getName()));
					dyda.setPctableoptype(DynamicDataUtil.OP_UPDATE);
					dyda.setPctableuids(coUnit.getUids());
					dyda.setPcdynamicdate(new Date());
					dyda.setPcurl(DynamicDataUtil.PROJECT_PARTNER_URL);
					zhxxDAO.insert(dyda);
					objList.add(dyda);
				}
			}
			if(dType.equals("A")){
			PCDataExchangeService exchangeServiceImp = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List<PcDataExchange> exchangeList = exchangeServiceImp.getExcDataList(objList,tounit,fromunit,null,null,
					"项目合作单位编辑【"+fromunit+"】");
			exchangeServiceImp.addExchangeListToQueue(exchangeList);
		}
		return "";
	}
	/**
	 * 数据交互（项目单位->集团），项目主要合作单位删除
	 * @param ids 删除的记录id
	 * @param fromunit 发送单位
	 * @param tounit  接收单位
	 * @author liangwj
	 * @since 2011-10-31
	 * @return
	 */
	public String sendCoUnitToJTDEL(String ids, String fromunit, String tounit){
		//Constant.propsMap.put("DEPLOY_UNITTYPE","A");
		String dType = Constant.propsMap.get("DEPLOY_UNITTYPE")==null?"0":Constant.propsMap.get("DEPLOY_UNITTYPE");
		if(dType.equals("A")){
			String[] id=ids.split(",");
			List<PcZhxxPrjPartner> partnerList = new ArrayList<PcZhxxPrjPartner>();
			for(int i=0; i<id.length;i++){
				PcZhxxPrjPartner partner=new PcZhxxPrjPartner();
				partner.setUids(id[i]);
				partnerList.add(partner);
			}
			PCDataExchangeService exchangeServiceImp = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List<PcDataExchange> exchangeList = exchangeServiceImp.getExcDataList(partnerList,tounit,fromunit,null,null,"项目合作单位删除【"+fromunit+"】");
			exchangeServiceImp.addExchangeListToQueue(exchangeList);
		}
		return "";
	}
	
	public void validateImage(PcZhxxPrjKeyMan keyman){
		PcZhxxPrjKeyMan hbm = (PcZhxxPrjKeyMan) zhxxDAO.findById(PcZhxxPrjKeyMan.class.getName(), keyman.getUids());
		if(hbm!=null){
			if(hbm.getImage()!=null){
				if(zhxxDAO.getDataAutoCloseSes("select fileid count_num from app_blob " +
						"where fileid='"+hbm.getImage()+"'").size()==0){
					hbm.setImage(null);
					zhxxDAO.saveOrUpdate(hbm);
				}
			}
		}else{
			if(keyman.getImage()!=null){
				if(zhxxDAO.getDataAutoCloseSes("select fileid count_num from app_blob " +
						"where fileid='"+keyman.getImage()+"'").size()!=0){
					zhxxDAO.deleteFileInBlob(keyman.getImage());
				}
			}
		}
	}
	
	/**
	 * MIS定时上报资金来源表中数据的变更。针对新增和修改功能
	 * @param idsOfInsert
	 * @param idsOfUpdate
	 * @param pid
	 * @modify by liangwj at 2011-10-31 待报送数据增加发送单位
	 */
	@SuppressWarnings("unchecked")
	public void sendFundsrcToJT(String idsOfInsert, String idsOfUpdate,String pid){
		//首先判断是否需要数据交互
		if(!(getRemoteUrlByUnitid(pid).equals(""))){
			String uids =idsOfInsert+","+idsOfUpdate;
			if(idsOfInsert.equals("") ||idsOfUpdate.equals("")){
				uids=idsOfInsert+idsOfUpdate;
			}
			uids=uids.replaceAll(",", "','");
			uids="('"+uids+"')";
			String sql="uids in "+uids;
			
			List<PcZhxxPrjFundsrc> fundsrcList = zhxxDAO.findByWhere2(PcZhxxPrjFundsrc.class.getName(),sql);
			PCDataExchangeService exchangeServiceImp = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List<PcDataExchange> exchangeList = exchangeServiceImp.getExcDataList(fundsrcList,
					Constant.DefaultOrgRootID,pid, null, null, "资金来源信息编辑【"+pid+"】");
			exchangeServiceImp.addExchangeListToQueue(exchangeList);
		}
	}
	/**
	 *  MIS定时上报资金来源表中数据的变更。针对删除功能。
	 * @param ids
	 * @param pid
	 * @modify by liangwj at 2011-10-31 待报送数据增加发送单位
	 */
	public void sendFundsrcToJTDEL(String ids, String pid){
		//首先判断是否需要数据交互
		if(!(getRemoteUrlByUnitid(pid).equals(""))){
			String[] id=ids.split(",");
			List<PcZhxxPrjFundsrc> fundsrcList = new ArrayList<PcZhxxPrjFundsrc>();
			for(int i=0; i<id.length;i++){
				PcZhxxPrjFundsrc fundsrc=new PcZhxxPrjFundsrc();
				fundsrc.setUids(id[i]);
				fundsrcList.add(fundsrc);
			}
			PCDataExchangeService exchangeServiceImp = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List<PcDataExchange> exchangeList = exchangeServiceImp.getExcDataList(fundsrcList,
					Constant.DefaultOrgRootID,pid, null, null, "资金来源信息编辑【"+pid+"】");
			exchangeServiceImp.addExchangeListToQueue(exchangeList);
		}
	}
	/**
	 * 文件删除的数据交换
	 * @modify by liangwj at 2011-10-31 待报送数据增加发送单位
	 */
	public void fileDeleteDataEx(String[] fidArr,String pid){
		//首先判断是否需要数据交互
		if(!(getRemoteUrlByUnitid(pid).equals(""))){
			PCDataExchangeService exchangeServiceImp = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			String curTxGroup = SnUtil.getNewID("tx-");
			Long curXh=exchangeServiceImp.getNewExchangeXh(pid);
			List<PcDataExchange> exchangeList=new ArrayList<PcDataExchange>();
			String sqlBefore="('";
			if(fidArr.length>0)sqlBefore="('"+fidArr[0];
			for(int i=0; i<fidArr.length; i++){
				if(i != fidArr.length-1 )sqlBefore=sqlBefore+"','"+fidArr[i+1];
				PcDataExchange exchange = new PcDataExchange();
				exchange.setTableName("SGCC_ATTACH_BLOB");
				exchange.setBlobCol("FILE_NR");
				JSONArray kvarr = new JSONArray();
				JSONObject kv = new JSONObject();
				kv.put("FILE_LSH", fidArr[i]);
				kvarr.add(kv);
				exchange.setKeyValue(kvarr.toString());
				exchange.setSuccessFlag("0");
				exchange.setXh(curXh+i);
				exchange.setPid(Constant.DefaultOrgRootID);
				exchange.setTxGroup(curTxGroup);
				exchange.setBizInfo("项目介绍删除【"+pid+"】");//业务说明
				exchangeList.add(exchange);
			}
			sqlBefore=sqlBefore+"')";
			exchangeList.get(0).setSpareC1("delete from SGCC_ATTACH_LIST where FILE_LSH in "+sqlBefore);
			exchangeList.get(0).setSpareC5(pid);
			exchangeServiceImp.addExchangeListToQueue(exchangeList);
		}
	}
	/**
	 * 文件上传的数据交换
	 * @modify by liangwj at 2011-10-31 待报送数据增加发送单位
	 */
	public void fileUploadDataEx(String fileLsh, String businessId, String businessType, String blobTable, String pid){
		//首先判断是否需要数据交互
		if(!(getRemoteUrlByUnitid(pid).equals(""))){
			PCDataExchangeService exchangeServiceImp = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			
			FileManagementService fileManagementServiceImp=(FileManagementService)Constant.wact.getBean("fileServiceImpl");
			String whereSql="TRANSACTION_TYPE='"+businessType+"' and TRANSACTION_ID='"+businessId+"' and FILE_LSH='"+fileLsh+"'";
			List<SgccAttachList> attachList = fileManagementServiceImp.geAttachListByWhere(whereSql, null, null);
			List<PcDataExchange> exchangeList=exchangeServiceImp.getExcDataList(attachList,Constant.DefaultOrgRootID,pid,
					null,null,"项目介绍上传【"+pid+"】");
			
			if(exchangeList.size()>0) {
				Long curXh=exchangeList.get(0).getXh()+1;
				String curTxGroup = exchangeList.get(0).getTxGroup();
				
				JSONArray kvarr = new JSONArray();
				JSONObject kv = new JSONObject();
				kv.put("FILE_LSH", fileLsh);
				kvarr.add(kv);
				
				PcDataExchange exchange = new PcDataExchange();
				exchange.setTableName(blobTable.toUpperCase());
				exchange.setBlobCol("FILE_NR");
				exchange.setKeyValue(kvarr.toString());
				exchange.setSuccessFlag("0");
				exchange.setXh(curXh);
				exchange.setPid(Constant.DefaultOrgRootID);
				exchange.setBizInfo("项目介绍上传【"+pid+"】");
				exchange.setTxGroup(curTxGroup);
				exchange.setSpareC5(pid);
				
				exchangeList.add(exchange);
				
				exchangeServiceImp.addExchangeListToQueue(exchangeList);
			}

		}
	}
	
	public String getUnumber(String temp) throws SQLException, BusinessException{
		String regEx="^"+temp+"[0-9]{2}";//生成正则表达式
		String sql="select unitid_no from (select SUBSTR(unitid,-2,2) unitid_no from sgcc_ini_unit where REGEXP_LIKE( unitid, '"+regEx+"') order by unitid desc) where rownum=1";
		List<Map> list=JdbcUtil.query(sql);
		String stringNumber="02";
		if(!list.isEmpty()){
			String conno_number=list.get(0).get("unitid_no").toString();
			int intNumber= Integer.parseInt(conno_number);
			intNumber+=1;
			stringNumber=String.valueOf(intNumber);
			if(stringNumber.length()<2 && stringNumber.length()>0) stringNumber="0"+stringNumber;
		}
		return temp+stringNumber;

	}
	
	@SuppressWarnings("unchecked")
	public String getPreUnumber(String temp) throws SQLException, BusinessException{
		String regEx="^"+temp+"[0-9]{2}$";//生成正则表达式
		String sql="select substr(pid, -2, 2) pid_no from (select pid from pc_zhxx_qianq_prj_info where REGEXP_LIKE( pid, '"+regEx+"') order by pid desc) where rownum=1";
		List<Map> list=JdbcUtil.query(sql);
		String stringNumber="02";
		if(!list.isEmpty()){
			String conno_number=list.get(0).get("pid_no").toString();
			int intNumber= Integer.parseInt(conno_number);
			intNumber+=1;
			stringNumber=String.valueOf(intNumber);
			if(stringNumber.length()<2 && stringNumber.length()>0) stringNumber="0"+stringNumber;
		}
		return temp+stringNumber;
	}
	
	public Map<String, String> getQuaProjectSheduleByPid(String pid) {
		Map<String, String> map = new HashMap<String,String>();
		return map;
	}

	public Map<String, String> getAqgkProjectSheduleByPid(String pid) {
		Map<String,String> map = new HashMap<String,String>();
		List list=zhxxDAO.findByWhere2(PcAqgkAccidenrInfo.class.getName(), "pid='"+pid+"' and accidentType='RSSG' and REPORT_STATUS in (1,3)");
		map.put("rsAcc", ""+list.size());
		list=zhxxDAO.findByWhere2(PcAqgkAccidenrInfo.class.getName(), "pid='"+pid+"' and accidentType='SBSG' and REPORT_STATUS in (1,3)");
		map.put("sbAcc", ""+list.size());
		list=zhxxDAO.findByWhere2(PcAqgkAccidenrInfo.class.getName(), "pid='"+pid+"' and accidentType='other' and REPORT_STATUS in (1,3)");
		map.put("otherAcc", ""+list.size());
		return map;
	}

	@SuppressWarnings("unchecked")
	public Map<String, String> getAllProjectSheduleByPid(String pid,String totalMoney) {
		Map<String, String>  map = new HashMap<String, String>();
		Map<String, String> bidMap = pcBidApplyService.getProjectScheduleByPid(pid, totalMoney);
		map.putAll(bidMap);
		Map<String, String> bdgMap = pcBdgInfoMgm.getProjectShedulePercentByPid(pid);
		map.putAll(bdgMap);
		Map<String, String> conMap = pcConMgm.getProjectSheduleByPid(pid);
		map.putAll(conMap);
		Map<String, String> zlgkMap = zlgkImpl.getProjectSheduleByPid(pid);
		map.putAll(zlgkMap);
		Map<String, String> aqgkMap = getAqgkProjectSheduleByPid(pid);
		map.putAll(aqgkMap);
		Map<String, String> proMap = getQuaProjectSheduleByPid(pid);
		map.putAll(proMap);
		return map;
	}
	/**
    * 项目单位上报本单位的组织机构到集团公司
    * @param pid  项目单位编码
    * @param acceptUnitId 集团公司单位编码
    * @return
    */
	public String reportUnitData(String pid, String acceptUnitId) {
		try{
			PCDataExchangeService exchangeService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			String beforeSQL = "delete from sgcc_ini_unit where uids in (select u.uids from sgcc_ini_unit u connect by " +
								"prior u.unitid=u.upunit start with u.upunit = '"+pid+"')";
			String sql = "select u.uids from sgcc_ini_unit u connect by prior u.unitid=u.upunit start with u.upunit = '"+pid+"'";
			List lt1 = zhxxDAO.getDataAutoCloseSes(sql);
			List<SgccIniUnit> lt2 = new ArrayList<SgccIniUnit>();
			List<PcDataExchange> lt3 = new ArrayList<PcDataExchange>();
			for(int i=0,j=lt1.size();i<j;i++){
				String uids = lt1.get(i).toString();
				SgccIniUnit hbm = new SgccIniUnit();
				hbm.setId(uids);
				lt2.add(hbm);
			}
			if(lt2.size()>0){
				lt3 = exchangeService.getExchangeDataList(lt2, acceptUnitId, beforeSQL, null, 
						"项目编码为【"+pid+"】的项目单位组织机构报送。");
			}else{
				PcDataExchange pe = new PcDataExchange();
				pe.setSqlData("delete from sgcc_ini_unit where 1=2");
				pe.setSpareC1(beforeSQL);
				pe.setPid(acceptUnitId);
				pe.setTxGroup("tx"+SnUtil.getNewID());
				pe.setBizInfo("项目编码为【"+pid+"】的项目单位组织机构报送。");
				lt3.add(pe);
			}
			
			Map<String,String> msg = exchangeService.sendExchangeData(lt3);
			//如果及时发送失败，则添加到队列进行定时发送
			if(msg!=null&&msg.containsKey("result")&&msg.get("result")!=null&&msg.get("result").equals("fail")){
			}
			exchangeService.addExchangeListToQueue(lt3);
			return "ok";
		}catch (BusinessException e) {
			return e.getMessage();
		}
	}
	
	public int checkFundsrcEqual(String pid){
		List<PcZhxxPrjFundsrc> fundsrcList = (List<PcZhxxPrjFundsrc>) zhxxDAO.findByProperty(PcZhxxPrjFundsrc.class.getName(), "pid", pid);
		PcZhxxPrjInfo prj = (PcZhxxPrjInfo) zhxxDAO.findBeanByProperty(PcZhxxPrjInfo.class.getName(), "pid", pid);
		int investScale=0;
		if(prj==null){
			return 0;
		}else if(prj.getInvestScale()!=null){
			investScale=Integer.parseInt(prj.getInvestScale());
		}
		int total=0;
		for(Iterator iter=fundsrcList.iterator();iter.hasNext();){
			PcZhxxPrjFundsrc fundsrc=(PcZhxxPrjFundsrc)iter.next();
			if(fundsrc.getAmount()!=null){
				total+=Integer.parseInt(fundsrc.getAmount());
			}
		}
		return total-investScale;
	}
	 /**
	    * 
	    * @param fileName flex配置文件名称 使用逗号隔开
	    * @param matched  文件名称是否匹配，如果为false则不匹配，例如filename=zhxx， matched = ture 则会匹配文件zhxx.cml、zhxx-debug.cml。
	    *                 如果matched=false ，则只列出zhxx.cml
	    * @return
	    */
	public List<JSONObject> getCmlFileList(String fileNames, boolean matched) {
		SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		List<File> cmlLt = new ArrayList<File>();
		File folder = new File(CMLPATH);
		//System.out.println(CMLPATH);
		if(folder.exists()&&folder.isDirectory()){
			File[] subFiles = folder.listFiles();
			for(int i = 0 ;i < subFiles.length; i++) {
				File file = subFiles[i];
				if(!file.isDirectory()){
					cmlLt.add(file);
					//System.out.println(file.getName());
				}
			}
		}
		
		List<JSONObject> lt = new ArrayList<JSONObject>();

		JSONArray ja = JSONArray.fromObject(fileNames);
		for(int a=0;a<ja.size();a++){
			JSONObject o = ja.getJSONObject(a);
			String type = o.getString("type");
			if(type!=null){
				for(int i=cmlLt.size()-1;i>=0;i--){
					File f = cmlLt.get(i);
					String name = f.getName();
					if(matched){
						if(name.startsWith(type)){
							JSONObject o1 = new JSONObject();
							o1.put("bizname", o.get("bizname"));
							o1.put("type", type);
							o1.put("state", name.equals(type.concat(".cml")));
							o1.put("filename", name);
							o1.put("path", Constant.AppRoot.concat("PCBusiness/cml/").concat(name));
							o1.put("date", sdf.format(new Date(f.lastModified())));
							lt.add(o1);
						}
					}else{
						if(name.equals(type.concat(".cml"))){
							JSONObject o1 = new JSONObject();
							o1.put("bizname", o.get("bizname"));
							o1.put("type", type);
							o1.put("state", true);
							o1.put("filename", name);
							o1.put("path",  Constant.AppRoot.concat("PCBusiness/cml/").concat(name));
							o1.put("date", sdf.format(new Date(f.lastModified())));
							lt.add(o1);
						}	
					}
				}
			}
		}
		return lt;
	}
	/**
	    * 保存配置文件
	    * @param xmlStr
	    * @param fileName
	    * @return
	    */
	public boolean saveCmlFile(String xmlStr, String fileName) {
		try {
			 File f = new File(CMLPATH.concat(fileName));
			 if(!f.exists()){
				 f.createNewFile();
			 }
			FileOutputStream os = new FileOutputStream(f);
			byte[] b = xmlStr.getBytes("UTF-8");
			os.write(b);
			os.close();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	/**
    * 启用配置文件
    * @param fileName
    * @param type
    * @return
    */
   public boolean activeCml(String fileName, String type){
	   try {
		   File f = new File(CMLPATH.concat(type).concat(".cml"));
		   if(f.exists()){
			   f.renameTo(new File(CMLPATH.concat(type).concat("-").concat(SnUtil.getNewID()).concat(".cml")));
		   }
		   
		   File f2 = new File(CMLPATH.concat(fileName));
		   if(f2.exists()){
			   f2.renameTo(new File(CMLPATH.concat(type).concat(".cml")));
		   }
		   return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
   }
   /**
    * 备份配置文件
    * @param fileName
    * @param type
    * @return
    */
   public boolean backupCml(String fileName, String type){
	   try {
		   File f = new File(CMLPATH.concat(fileName));
		   if(f.exists()){
			   FileInputStream in = new FileInputStream(f);
			   FileOutputStream os = new FileOutputStream(new File(CMLPATH.concat(type)
					   .concat("-").concat(SnUtil.getNewID()).concat(".cml")));
	           int b; 
	           while ( (b = in.read()) != -1) { 
	        	   os.write(b); 
	           } 
			   in.close();
			   os.close();
		   }
		   return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
   }
   /**
    * 删除备份的文件
    * @param fileName
    * @param type
    * @return
    */
   public boolean deleteCml(String fileName, String type){
	   try {
		   File f = new File(CMLPATH.concat(fileName));
		   if(f.exists()){
			   f.delete();
		   };
		   return true;
	   } catch (Exception e) {
		   e.printStackTrace();
		   return false;
	   }
   }
   
   @SuppressWarnings({ "unchecked", "rawtypes" })
public List<JSONObject> welcomePage(String orderBy, Integer start,
			Integer limit, HashMap<String, String> params){
	   List<JSONObject> list = new ArrayList<JSONObject>();
	   List<SgccIniUnit> unitList=zhxxDAO.findByWhere2(SgccIniUnit.class.getName(), "unitTypeId='2' order by viewOrderNum desc");
	   for(int i=unitList.size();i>0;i--){
		   SgccIniUnit obj_unit=unitList.get(i-1);
		   String unitname=obj_unit.getUnitname();
		   String unitid=obj_unit.getUnitid();
		   List <PcZhxxPrjInfo> prjList =zhxxDAO.findByWhere2(PcZhxxPrjInfo.class.getName(), "pid like '"+unitid+"%'");
		   int prjTotal=prjList.size();
		   int xjTotal=0;
		   int kjTotal=0;
		   int gjTotal=0;
		   Double investTotal=0d;
		   for(int j=prjTotal;j>0;j--){
			   PcZhxxPrjInfo obj_prj=prjList.get(j-1);
			   String buildNature = obj_prj.getBuildNature();
			   if(buildNature!=null){
				   if(buildNature.equals("XJ")){
					   xjTotal+=1;
				   }else if(buildNature.equals("KJ")){
					   kjTotal+=1;
				   }else if(buildNature.equals("GJ")){
					   gjTotal+=1;
				   }
			   }
			   String investScale=obj_prj.getInvestScale();
			   if(investScale!=null)investTotal+=Double.valueOf(investScale);
		   }
		   Double fundSrcTotal=0d;
		   Double zbjjtTotal=0d;
		   Double zbjqtTotal=0d;
		   Double zbjzyTotal=0d;
		   Double dkTotal=0d;
		   Double qtTotal=0d;
		   String sql="select ( select sum(s1.amount) from pc_zhxx_prj_fundsrc s1 where s1.pid like '"+unitid+"%' and s1.src_type = 'ZBJJT' ) src_zbjjt,"+
			"( select sum(s2.amount) from pc_zhxx_prj_fundsrc s2 where s2.pid like '"+unitid+"%' and s2.src_type = 'ZBJZY' ) src_zbjzy,"+
			"( select sum(s3.amount) from pc_zhxx_prj_fundsrc s3 where s3.pid like '"+unitid+"%' and s3.src_type = 'ZBJQT' ) src_zbjqt,"+
			"( select sum(s4.amount) from pc_zhxx_prj_fundsrc s4 where s4.pid like '"+unitid+"%' and s4.src_type = 'DK' ) src_dk,"+
			"( select sum(s5.amount) from pc_zhxx_prj_fundsrc s5 where s5.pid like '"+unitid+"%' and s5.src_type = 'QT' ) src_qt,"+
			"( select sum(s7.amount) from pc_zhxx_prj_fundsrc s7 where s7.pid like '"+unitid+"%') invest_total from dual"; 
			List<Map> tempList=JdbcUtil.query(sql);
			if(tempList.size()>0){
				Map map=tempList.get(0);
				BigDecimal invest_total=(BigDecimal)(map.get("invest_total")==null ? new BigDecimal(0):map.get("invest_total"));
				fundSrcTotal=invest_total.doubleValue();
				BigDecimal src_zbjjt=(BigDecimal)(map.get("src_zbjjt")==null? new BigDecimal(0):map.get("src_zbjjt"));
				zbjjtTotal=src_zbjjt.doubleValue();
				BigDecimal src_zbjqt=(BigDecimal)(map.get("src_zbjqt")==null? new BigDecimal(0):map.get("src_zbjqt"));
				zbjqtTotal=src_zbjqt.doubleValue();
				BigDecimal src_zbjzy=(BigDecimal)(map.get("src_zbjzy")==null? new BigDecimal(0):map.get("src_zbjzy"));
				zbjzyTotal=src_zbjzy.doubleValue();
				BigDecimal src_dk=(BigDecimal)(map.get("src_dk")==null? new BigDecimal(0):map.get("src_dk"));
				dkTotal=src_dk.doubleValue();
				BigDecimal src_qt=(BigDecimal)(map.get("src_qt")==null? new BigDecimal(0):map.get("src_qt"));
				qtTotal=src_qt.doubleValue();
			}
		   JSONObject jo = new JSONObject();
		   jo.put("unitname", unitname);
		   jo.put("unitid", unitid);
		   jo.put("prjTotal", prjTotal);
		   jo.put("xjTotal", xjTotal);
		   jo.put("kjTotal", kjTotal);
		   jo.put("gjTotal", gjTotal);
		   jo.put("investTotal", investTotal);
		   jo.put("fundSrcTotal", fundSrcTotal);
		   jo.put("zbjjtTotal", zbjjtTotal);
		   jo.put("zbjqtTotal", zbjqtTotal);
		   jo.put("zbjzyTotal", zbjzyTotal);
		   jo.put("dkTotal", dkTotal);
		   jo.put("qtTotal", qtTotal);
		   list.add(jo);
	   }
	   return list;
   }
   
   public List<JSONObject> prjCountIndex(String orderBy, Integer start,
			Integer limit, HashMap<String, String> params){
	   String unitid=params.get("unitid");
	   List<JSONObject> list = new ArrayList<JSONObject>();
//	   ApplicationMgmFacade appMgm=(ApplicationMgmFacade)Constant.wact.getBean("applicationMgm");
//	   List<PropertyCode> danWeiList=appMgm.getCodeValue("建设规模单位");
	   
	   SystemMgmFacade sysmgm= (SystemMgmFacade)Constant.wact.getBean("systemMgm");
	   List<SgccIniUnit> pidsList=sysmgm.getPidsByUnitid(unitid);
	   for(int i=0;i<pidsList.size();i++){
		   JSONObject jo = new JSONObject();
		   SgccIniUnit prjUnit= pidsList.get(i);
		   String pid="";
		   if(prjUnit !=null){
			   pid=prjUnit.getUnitid();
			   VPcZhxxPrjInfo prjInfo=(VPcZhxxPrjInfo)zhxxDAO.findBeanByProperty(VPcZhxxPrjInfo.class.getName(), "pid", pid);
			   if(prjInfo !=null){
				   jo.put("uids", prjInfo.getUids());
				   jo.put("pid", pid);
				   jo.put("prjName", prjInfo.getPrjName());
				   jo.put("industryTypeName", prjInfo.getIndustryTypeName());
				   jo.put("buildNatureName", prjInfo.getBuildNatureName());
				   String memoc2="";
				   
				   String danWei=" ";
				   if(prjInfo.getGuiMoDw()!=null)danWei+=prjInfo.getGuiMoDw();
				   if(prjInfo.getMemoC4()!=null && !prjInfo.getMemoC4().equals("")){
					   memoc2=prjInfo.getMemoC4()+danWei;
					   if(prjInfo.getMemoC2()!=null && !prjInfo.getMemoC2().equals("")){
						   memoc2=prjInfo.getMemoC2()+"x"+memoc2;
					   }
				   }
				   jo.put("memoC2",memoc2);
				   jo.put("investScale", prjInfo.getInvestScale());
				   jo.put("prjTypeName", prjInfo.getPrjTypeName());
				   jo.put("prjRespond", prjInfo.getPrjRespond());
				   
				   Double fundSrcTotal=0d;
				   Double zbjjtTotal=0d;
				   Double zbjqtTotal=0d;
				   Double zbjzyTotal=0d;
				   Double dkTotal=0d;
				   Double qtTotal=0d;
				   String sql="select ( select sum(s1.amount) from pc_zhxx_prj_fundsrc s1 where s1.pid = '"+pid+"' and s1.src_type = 'ZBJJT' ) src_zbjjt,"+
				   "( select sum(s2.amount) from pc_zhxx_prj_fundsrc s2 where s2.pid = '"+pid+"' and s2.src_type = 'ZBJZY' ) src_zbjzy,"+
				   "( select sum(s3.amount) from pc_zhxx_prj_fundsrc s3 where s3.pid = '"+pid+"' and s3.src_type = 'ZBJQT' ) src_zbjqt,"+
				   "( select sum(s4.amount) from pc_zhxx_prj_fundsrc s4 where s4.pid = '"+pid+"' and s4.src_type = 'DK' ) src_dk,"+
				   "( select sum(s5.amount) from pc_zhxx_prj_fundsrc s5 where s5.pid = '"+pid+"' and s5.src_type = 'QT' ) src_qt,"+
				   "( select sum(s7.amount) from pc_zhxx_prj_fundsrc s7 where s7.pid = '"+pid+"' and s7.src_type in ('ZBJJT','ZBJZY','ZBJQT','DK','QT')) invest_total from dual"; 
				   List<Map> tempList=JdbcUtil.query(sql);
				   if(tempList.size()>0){
					   Map map=tempList.get(0);
					   BigDecimal invest_total=(BigDecimal)(map.get("invest_total")==null ? new BigDecimal(0):map.get("invest_total"));
					   fundSrcTotal=invest_total.doubleValue();
					   BigDecimal src_zbjjt=(BigDecimal)(map.get("src_zbjjt")==null? new BigDecimal(0):map.get("src_zbjjt"));
					   zbjjtTotal=src_zbjjt.doubleValue();
					   BigDecimal src_zbjqt=(BigDecimal)(map.get("src_zbjqt")==null? new BigDecimal(0):map.get("src_zbjqt"));
					   zbjqtTotal=src_zbjqt.doubleValue();
					   BigDecimal src_zbjzy=(BigDecimal)(map.get("src_zbjzy")==null? new BigDecimal(0):map.get("src_zbjzy"));
					   zbjzyTotal=src_zbjzy.doubleValue();
					   BigDecimal src_dk=(BigDecimal)(map.get("src_dk")==null? new BigDecimal(0):map.get("src_dk"));
					   dkTotal=src_dk.doubleValue();
					   BigDecimal src_qt=(BigDecimal)(map.get("src_qt")==null? new BigDecimal(0):map.get("src_qt"));
					   qtTotal=src_qt.doubleValue();
					   
					   jo.put("fundSrcTotal", fundSrcTotal);
					   jo.put("zbjjtTotal", zbjjtTotal);
					   jo.put("zbjqtTotal", zbjqtTotal);
					   jo.put("zbjzyTotal", zbjzyTotal);
					   jo.put("dkTotal", dkTotal);
					   jo.put("qtTotal", qtTotal);
				   }
				   list.add(jo);
			   }
		   }
	   }
	   return list;
   }
   /**
    * 由给定的单位编码查询远程应用地址
    * @param unitid
    * @return
    */
   private String getRemoteUrlByUnitid(String unitid){
	   String remoteUrl = "";
	   try{
		   SgccIniUnit unitHbm=(SgccIniUnit) zhxxDAO.findBeanByProperty(SgccIniUnit.class.getName(), 
				   "unitid", unitid);
		   if(unitHbm!=null&&unitHbm.getAppUrl()!=null&&!(unitHbm.getAppUrl().equals(""))){
			   remoteUrl = unitHbm.getAppUrl();
		   }else{
			   remoteUrl = "";   
		   }
	   }catch (BusinessException e) {
			 e.printStackTrace();
	   }
	   return remoteUrl;
   }
   
	/**
	 * 功能: 判断用户输入的项目编号是否已经被使用
	 * @param pid String 用户输入的项目编号
	 * @return String "0": 编号已经被使用;  "1": 编号可以使用; "2":提示项目编号不可以为空 
	 */
	@SuppressWarnings("unchecked")
	public String checkPidBeUsed(String pid) throws SQLException, BusinessException 
	{
		if(pid==null||pid.equals("0"))
		{
			return "2";
		}
		List<VPcPwPrjInfo> vPrjInfo = zhxxDAO.findByWhere2(com.sgepit.pcmis.approvl.hbm.VPcPwPrjInfo.class.getName(),"pid like '%'");
		if(vPrjInfo.isEmpty()) 
		{
			 return "1";  
		}
		else
		{
			for(Iterator itor = vPrjInfo.iterator(); itor.hasNext();)
			{
				
				VPcPwPrjInfo hbm = (VPcPwPrjInfo)itor.next();
				if(pid.equals(hbm.getPid()))
				{
					return "0";
				}
			}
		}
		return "1";
	}
	
	/**
	 * 前期项目转换为正式项目
	 * @param uids 主键
	 * @param newPid 选择三级公司后新的项目编号
	 * @param prjStage  新选择的项目阶段
	 * @return String "0"--转换失败 ""
	 */
	@SuppressWarnings("unchecked")
	public String prjSwitch(String uids, String newPid, String prjStage, String upUnitId) throws SQLException, BusinessException
	{
		String flag = "0";
		Connection conn = null;
		Statement stmt = null;
		try{
			List<PcZhxxQianqPrjInfo> prjList = 
					zhxxDAO.findByWhere2(com.sgepit.pcmis.zhxx.hbm.PcZhxxQianqPrjInfo.class.getName(),
											"uids='"+uids+"'");
			PcZhxxQianqPrjInfo qPrjInfo = prjList.get(0);
			
			//将数据写入正式项目表
			//生成主键
			String sgccPK = UUID.randomUUID().toString().replace("-", "");
			String zhxxPK = UUID.randomUUID().toString().replace("-", "");
			String addSql = "insert into pc_zhxx_prj_info select " +
					"tab1.pid," +
					"tab1.pid," +
					"tab1.industry_type," +
					"tab1.build_nature," +
					"tab1.prj_stage," +
					"tab1.prj_type," +
					"tab1.prj_name," +
					"tab1.prj_respond," +
					"tab1.invest_scale," +
					"tab1.build_limit," +
					"tab1.fund_src," +
					"tab1.prj_address," +
					"tab1.prj_summary," +
					"tab1.memo," +
					"tab1.build_start," +
					"tab1.build_end," +
					"tab1.memo_c1," +
					"tab1.memo_c2," +
					"tab1.memo_c3," +
					"tab1.memo_c4," +
					"tab1.isapproved," +
					"tab1.isapproval," +
					"tab1.totalinvestment," +
					"tab1.gui_mo_dw," +
					"tab1.jian_cheng," +
					"tab1.backup_c2," +
					"tab1.backup_c3," +
					"tab1.backup_c1 " +
					"from pc_zhxx_qianq_prj_info tab1 where tab1.uids='"+uids+"'";
			//更新刚加入的数据的pid字段为newPid
			String updateSQL = "update pc_zhxx_prj_info info set " +
									"pid='" + newPid + "', " +
									"uids='"+ zhxxPK +"', " +
									"prj_stage='" + prjStage +"' " +
									"where info.uids='"+qPrjInfo.getPid()+"'";
			//将数据写入组织机构表, 将项目编号作为该条记录主键;
			int view_num = 1;
			String state = "1";
			String addSgccSql = "insert into sgcc_ini_unit (unitid,unitname,upunit,uids,view_order_num,state,unit_type_id) values('"+
			newPid+"','"+
			qPrjInfo.getPrjName()+"','"+
			upUnitId+"','"+
			sgccPK+"','"+
			view_num+"','"+
			"1"+"','"+
			"A"+"'"+
			")";
			
			//更新批文初始化表中对应项目pid
			String upDateSQL1 = "update pc_pw_sort_tree_sub set pid='"+newPid+"' where pid='"+qPrjInfo.getPid()+"'";
			
			//更新批文办理录入表对应前期项目pid
			String upDateSQL2 = "update pc_pw_approval_mgm set pid='"+newPid+"' where pid='"+qPrjInfo.getPid()+"'";
			
			//更新批文建议表
			String upDateSQL3 = "update pc_pw_approval_advise set pid='"+newPid+"' where pid='"+qPrjInfo.getPid()+"'";
			
			//从前期项目维护表中删除转换项目记录
			String delSQL = "delete from pc_zhxx_qianq_prj_info where pid='"+qPrjInfo.getPid()+"'";
			conn = HibernateSessionFactory.getConnection();
			conn.setAutoCommit(false);
			stmt = conn.createStatement();
			stmt.execute(addSql);
			stmt.execute(updateSQL);
			stmt.execute(addSgccSql);
			stmt.execute(upDateSQL1);
			stmt.execute(upDateSQL2);
			stmt.execute(upDateSQL3);
			stmt.execute(delSQL);
			conn.commit();
			
			flag="1";
		}catch(Exception e){
			e.printStackTrace();
			conn.rollback();
		}finally{
			stmt.close();
			conn.close();
		}
		
		return flag;
	}
	
	/**
	 * 添加或修改项目单位所不需要显示的模块
	 * 
	 * @param sum
	 * @param unid
	 * @return
	 */

	public String addOrUpdateSgccUnitModule(SgccUnitModule[] sums, String unid) {
		String flag = "0";
		List<SgccUnitModule> lst = getSgccUnitModuleByUnitid(
				"com.sgepit.pcmis.zhxx.hbm.SgccUnitModule", "unitid", unid);
		try {
			if (sums.length == 0) {//没有勾选模块，如果数据库原先有数据，则全部删除
				if (lst.size() > 0) {
					this.zhxxDAO.deleteAll(lst);
				}
				flag = "1";
			} else {
				Iterator<SgccUnitModule> items = lst.iterator();
				while (items.hasNext()) {
					boolean flags = false;
					SgccUnitModule sgm = items.next();
					for (int i = 0; i < sums.length; i++) {
						if (sgm.getPowerpk().equals(sums[i].getPowerpk())) {
							flags = true;
						}
					}
					if (!flags) {
						this.zhxxDAO.delete(sgm);
					}
				}
				for (int i = 0; i < sums.length; i++) {
					List<SgccUnitModule> ls = this.zhxxDAO
							.findByExample(sums[i]);
					if (ls.size() > 0) {// 
						flag = "1";
					} else {// 新增
						this.zhxxDAO.insert(sums[i]);
						flag = "1";
					}
				}
			}
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}

	/**
	   * 根据项目单位id查询该单位不需要显示的模块
	   * @param bean beanName
	   * @param propertyName   unitid
	   * @param unitid  项目单位id
	   * @return
	   */
	public List getSgccUnitModuleByUnitid(String bean, String propertyName,
			String unitid) {
		return this.zhxxDAO.findByProperty(bean, propertyName, unitid);
	}
	
	/**
	    * 根据模块id查询该模块不需要显示的项目单位名称
	    * @param bean
	    * @param propertyName
	    * @param moduleid
	    * @return
	    */
	public List getSgccUnitModuleByModuleid(String bean, String propertyName,
			String moduleid) {
		return this.zhxxDAO.findByProperty(bean, propertyName, moduleid);
	}

	/**
    * 新兴能源公司首页在建项目统计取数
    * @param pid
    * @return
    * @author zhangh 2012-06-06
    */
	@SuppressWarnings("unchecked")
	public List getProIndexData(String pid,String sjType) {
		PcZhxxProIndex pcZhxxProIndex = new PcZhxxProIndex();
		List<PcZhxxProIndex> list = new ArrayList<PcZhxxProIndex>();
		DecimalFormat df2 = new DecimalFormat("#.00");
		DecimalFormat df0 = new DecimalFormat("#");
        
		//下属所有项目
		String sqlPrj = "select t.unitid from sgcc_ini_unit t where " +
				" t.unit_type_id = 'A' start with t.unitid = '"+pid+"' " +
				" connect by PRIOR  t.unitid = t.upunit ";
		
		//1.在建发电项目
		String sql1 = "select t.* from pc_zhxx_prj_info t where " +
				" t.PRJ_TYPE in ('FD','HD','SD','GF','RD','HDX') and t.prj_stage NOT in ('JG','JS') AND  t.pid in ("+sqlPrj+")";
		List listPrjNum1 = JdbcUtil.query(sql1);
			pcZhxxProIndex.setPrjNum1(Double.valueOf(listPrjNum1.size()));
			
		//2.总装机容量
		String sql_zjrl = "select nvl(sum( t.memo_c2 * t.MEMO_C4),0) num from pc_zhxx_prj_info t" +
				" where t.gui_mo_dw = '01' and t.pid in ("+sqlPrj+") ";
		List<Map> list_zjrl = JdbcUtil.query(sql_zjrl);
		BigDecimal zjrl =(BigDecimal)list_zjrl.get(0).get("NUM");
			pcZhxxProIndex.setTotalCapacity(zjrl.doubleValue());
		
		//3.发电项目概算总金额
		String sql_bgd = "select nvl(sum(b.bdgmoney),0) num from bdg_info b where b.parent = '0' and b.pid in" +
				" (select t.pid from pc_zhxx_prj_info t where t.PRJ_TYPE in ('FD','HD','SD','RD') and t.pid in ("+sqlPrj+"))";
		List<Map> list_bdg = JdbcUtil.query(sql_bgd);
		BigDecimal bdg =(BigDecimal)list_bdg.get(0).get("NUM");
		//光伏概算总金额
		String sql_pid_gf = "select t.pid from pc_zhxx_prj_info t where t.PRJ_TYPE = 'GF' and t.pid in ("+sqlPrj+")";
		String sql_gf_m_uids = "Select m.uids from pc_tzgl_month_comp_m m " +
				" where m.sj_type = (select min(sj_type) from pc_tzgl_month_comp_m " +
				" where m.report_status in ('1','3') and unit_Id in ("+sql_pid_gf+") )";
		String sql_bgd_gf = "select nvl(t.zx_bdg,0) num from PC_TZGK_MONTH_COMP_DETAIL t " +
				" where t.master_id in ("+sql_gf_m_uids+")";
		List<Map> list_bdg_gf = JdbcUtil.query(sql_bgd_gf);
		
		BigDecimal bdg_gf =(BigDecimal) (list_bdg_gf.size()>0 ? list_bdg_gf.get(0).get("NUM") : new BigDecimal(0));
		BigDecimal bdgTotalBig = bdg_gf.add(bdg);
		bdgTotalBig = bdgTotalBig.divide(new BigDecimal(10000));
			pcZhxxProIndex.setBdgTotalMoney1(Double.parseDouble(df0.format(bdgTotalBig)));
		
		//4.在建非电项目
		String sql2 = "select t.* from pc_zhxx_prj_info t where " +
				" t.PRJ_TYPE = 'QT' and t.prj_stage NOT in ('JG','JS') and t.pid in ("+sqlPrj+")";
		List listPrjNum2 = JdbcUtil.query(sql2);
			pcZhxxProIndex.setPrjNum2(Double.valueOf(listPrjNum2.size()));
			
		//5.非电项目概算总金额
		String sql_bgd_qt = "select nvl(sum(b.bdgmoney),0) num from bdg_info b where b.parent = '0' and b.pid in" +
				" (select t.pid from pc_zhxx_prj_info t where t.PRJ_TYPE ='QT' and t.pid in ("+sqlPrj+"))";
		List<Map> list_bdg_qt = JdbcUtil.query(sql_bgd_qt);
		BigDecimal bdg_qt =(BigDecimal)list_bdg_qt.get(0).get("NUM");
		bdg_qt = bdg_qt.divide(new BigDecimal(10000));
			pcZhxxProIndex.setBdgTotalMoney2(Double.parseDouble(df0.format(bdg_qt)));
		
			
		String 	year = sjType.substring(0,4);
		String 	month = sjType.substring(4);
		if(sjType==null || sjType.equals("") || sjType.length()!=6){
			Calendar calendar = Calendar.getInstance();
			year = String.valueOf(calendar.get(Calendar.YEAR));
			month = String.valueOf(calendar.get(Calendar.MONTH)+1);
		}
		String minSjType = String.valueOf(year) + "00";
		String thisSjType = String.valueOf(year) + (month.length()==1?"0"+month:month);
		
		//6.本年投资完成总金额
		String sql_year_m_sj_type = "Select m.sj_type,m.pid from pc_tzgl_month_comp_m m " +
				" where m.sj_type>'"+minSjType+"' and m.sj_type<='"+thisSjType+"' " +
				" and m.report_status in ('1','3') and m.unit_id in ("+sqlPrj+") ";
		String sql_year_total = "select nvl(sum(t.MONTH_COMP),0) num from PC_TZGK_MONTH_COMP_DETAIL t, " +
				" ("+sql_year_m_sj_type+") tt" +
				" where t.sj_type = tt.sj_type and t.unit_id = tt.pid";
		List<Map> list_year_total = JdbcUtil.query(sql_year_total);
		BigDecimal year_total =(BigDecimal)list_year_total.get(0).get("NUM");
//		year_total = year_total.divide(new BigDecimal(10000));
			pcZhxxProIndex.setYearTzTotalMoney(Double.parseDouble(df0.format(year_total)));
			
		//7.本月投资完成总金额
		String sql_month_m_sj_type = "Select m.sj_type,m.pid from pc_tzgl_month_comp_m m " +
				" where m.sj_type='"+thisSjType+"' " +
				" and m.report_status in ('1','3') and m.unit_id in ("+sqlPrj+") ";
		String sql_month_total = "select nvl(sum(t.MONTH_COMP),0) num from PC_TZGK_MONTH_COMP_DETAIL t, " +
				" ("+sql_month_m_sj_type+") tt" +
				" where t.sj_type = tt.sj_type and t.unit_id = tt.pid";
		List<Map> list_month_total = JdbcUtil.query(sql_month_total);
		BigDecimal year_month =(BigDecimal)list_month_total.get(0).get("NUM");
//		year_month = year_month.divide(new BigDecimal(10000));
			pcZhxxProIndex.setMonthTzTotalMoney(Double.parseDouble(df0.format(year_month)));
		
      
		//8.本年累计付款金额
		String sql_year_pay = "select nvl(sum(t.PAYMONEY),0) num from con_pay t " +
				" where t.billstate = '1' and to_char(t.paydate,'yyyy') = '"+year+"' and t.pid in ("+sqlPrj+")";
		
		List<Map> list_year_pay = JdbcUtil.query(sql_year_pay);
		BigDecimal year_pay =(BigDecimal)list_year_pay.get(0).get("NUM");
		year_pay = year_pay.divide(new BigDecimal(10000));
		
		//光伏本年付款金额
	    BigDecimal getGfYearPayMoney;
    	String sql = "select nvl(sum(t.year_out), 0) as yearOut from PC_TZGK_MONTH_COMP_DETAIL t," +
    			     "(select max(m.sj_type) sj_type,m.pid  from pc_tzgl_month_comp_m m  where m.report_status in ('1', '3')" +
    			     "and m.unit_Id in (select t.PID from pc_zhxx_prj_info t where t.prj_type = 'GF')  group by m.pid) aa" +
    			     " where t.unit_id = aa.pid and t.sj_type  = aa.sj_type";
		List yearOut = JdbcUtil.query(sql);
		if(yearOut.size()==0){
			getGfYearPayMoney = new BigDecimal("0");
		}else{
			Map m = (Map) yearOut.get(0);
			getGfYearPayMoney = ((BigDecimal) m.get("yearOut"));//.setScale(0, BigDecimal.ROUND_HALF_UP);	
		}
		//累加 本年累计付款金额
		year_pay = year_pay.add(getGfYearPayMoney);
			//pcZhxxProIndex.setYearTotalPayMoney(Double.parseDouble(df0.format(year_pay)));	
			pcZhxxProIndex.setYearTotalPayMoney(Double.parseDouble(""+year_pay.setScale(0, BigDecimal.ROUND_HALF_UP)));
			
		//9.本月付款金额
		String sql_month_pay = "select nvl(sum(t.PAYMONEY),0) num from con_pay t " +
			" where t.billstate = '1' and to_char(t.paydate,'yyyymm') = '"+thisSjType+"' and t.pid in ("+sqlPrj+")";
		List<Map> list_mont_pay = JdbcUtil.query(sql_month_pay);
		BigDecimal month_pay =(BigDecimal)list_mont_pay.get(0).get("NUM");
		month_pay = month_pay.divide(new BigDecimal(10000));
			//pcZhxxProIndex.setMonthTotalPayMoney(Double.parseDouble(df0.format(month_pay)));
			pcZhxxProIndex.setMonthTotalPayMoney(Double.parseDouble(""+month_pay.setScale(0, BigDecimal.ROUND_HALF_UP)));
		
		list.add(pcZhxxProIndex);
		return list;
	}
	

	/**
	 * 查询地图和项目单位信息
	 * @return
	 * @author zhangh 2012-06-11
	 */
	public String getMapUnitInfo(String pid){
		//地图配置
		String mapSql = "select t.uids,t.property_code,t.property_name from property_code t where " +
				" t.type_name = (select uids t from property_type t where t.type_name ='地图配置')";
		List<Map<String, String>> list = JdbcUtil.query(mapSql);
		StringBuffer sbf = new StringBuffer("{citymap : [");
		Iterator<Map<String, String>> it = list.iterator();
		while (it.hasNext()) {
			Map<String, String> map = it.next();
			String uids = map.get("uids");
			String city = map.get("PROPERTY_CODE");
			String x = map.get("PROPERTY_NAME").split(",")[0];
			String y = map.get("PROPERTY_NAME").split(",")[1];
			
			String cityMapSql = "select BACKUP_C1,p.prj_name,p.pid,p.prj_type, " +
			" DECODE(p.prj_stage,'JS','YELLOW','JG','YELLOW','WHITE') color " +
			" from pc_zhxx_prj_info p where p.pid in " +
			" (select t.unitid from sgcc_ini_unit t where t.unit_type_id = 'A' " +
			" start with t.unitid = '"+pid+"' connect by PRIOR t.unitid = t.upunit) " +
			" and p.memo_c3 like '%"+city+"%' ";
			List<Map<String, String>> list2 = JdbcUtil.query(cityMapSql);
			
			if (list2.size() == 0) continue;
			
			sbf.append("{");
			sbf.append("city : '"+uids+"', ");
			sbf.append("citytop : "+x+", ");
			sbf.append("cityright : "+y+", ");
			sbf.append("infolist : [");
			
			Iterator<Map<String, String>> it2 = list2.iterator();
			while (it2.hasNext()) {
				Map<String, String> map2 = it2.next();
				String name = map2.get("PRJ_NAME");
				String shortname = map2.get("BACKUP_C1");
				if(shortname == null || shortname.equals("")) shortname = name;
				sbf.append("{");
				sbf.append("name : '"+name+"', ");
				sbf.append("color : '"+map2.get("color")+"', ");
				sbf.append("shortname : '"+shortname+"', ");
				sbf.append("pid : '"+map2.get("pid")+"', ");
				sbf.append("prjtype : '"+map2.get("PRJ_TYPE")+"' ");
				sbf.append("}");
				if (it2.hasNext())
					sbf.append(",");
			}
			sbf.append("]");
			sbf.append("}");
			if(it.hasNext())
				sbf.append(",");
		}
		sbf.append("],");
		//在建项目
		sbf.append("unitlist: [");
		String unitSql = "select BACKUP_C1,p.prj_name,p.pid,p.prj_type from pc_zhxx_prj_info p where " +
				" p.prj_stage not in ('JG','JS') and " +
				" p.pid in (select t.unitid from sgcc_ini_unit t where t.unit_type_id = 'A' " +
				" start with t.unitid = '"+pid+"' connect by PRIOR t.unitid = t.upunit) order by p.pid";
		List<Map<String, String>> list3 = JdbcUtil.query(unitSql);
		Iterator<Map<String, String>> it3 = list3.iterator();
		while (it3.hasNext()) {
			Map<String, String> map3 = it3.next();
			String name = map3.get("PRJ_NAME");
			String shortname = map3.get("BACKUP_C1");
			if(shortname == null || shortname.equals("")) shortname = name;
			sbf.append("{");
			sbf.append("name : '"+name+"', ");
			sbf.append("shortname : '"+shortname+"', ");
			sbf.append("pid : '"+map3.get("pid")+"', ");
			sbf.append("prjtype : '"+map3.get("PRJ_TYPE")+"' ");
			sbf.append("}");
			if (it3.hasNext())
				sbf.append(",");
		}
		sbf.append("],");
		//已竣工项目 unitlist_over
		//属性代码中“项目阶段”的属性值为“JG”和“JS”表示已经竣工
		sbf.append("unitlist_over: [");
		unitSql = "select BACKUP_C1,p.prj_name,p.pid,p.prj_type from pc_zhxx_prj_info p where" +
				" p.prj_stage in ('JG','JS') and " +
				" p.pid in (select t.unitid from sgcc_ini_unit t where t.unit_type_id = 'A' " +
				" start with t.unitid = '"+pid+"' connect by PRIOR t.unitid = t.upunit) order by p.pid";
		List<Map<String, String>> list4 = JdbcUtil.query(unitSql);
		Iterator<Map<String, String>> it4 = list4.iterator();
		while (it4.hasNext()) {
			Map<String, String> map4 = it4.next();
			String name = map4.get("PRJ_NAME");
			String shortname = map4.get("BACKUP_C1");
			if(shortname == null || shortname.equals("")) shortname = name;
			sbf.append("{");
			sbf.append("name : '"+name+"', ");
			sbf.append("shortname : '"+shortname+"', ");
			sbf.append("pid : '"+map4.get("pid")+"', ");
			sbf.append("prjtype : '"+map4.get("PRJ_TYPE")+"' ");
			sbf.append("}");
			if (it4.hasNext())
				sbf.append(",");
		}
		sbf.append("]");
		sbf.append("}");
		return sbf.toString();
	}
	
	/**
	 * 获取里程碑节点，风电火电分别获取初始化的14个和7个。其他获取根节点下第一层节点
	 * @param pid
	 * @return
	 * @author zhangh 2012-06-19
	 */
	public String getLiChengBeiByType(String pid){
		List<Map<String, String>> rtnList = new ArrayList<Map<String,String>>();
		String sql = "select PRJ_TYPE from pc_zhxx_prj_info where pid = '"+pid+"'";
		List<Map<String, String>> l = JdbcUtil.query(sql);
		String type = "";
		String typeStr = "";
		if (l.size()>0) {
			type = l.get(0).get("PRJ_TYPE");
			if(type!=null && type.equals("FD")){
				typeStr = "风电项目";
			}else if(type!=null && type.equals("HD")){
				typeStr = "火电项目";
			}else if(type!=null && type.equals("HDX")){
				typeStr = "火电项目新";
			}
		}
		String sql1 = "";
		if(typeStr.equals("")){
			sql1 = "select to_char(rownum) li_id,t.name_ li_name from edo_task t where t.projectuid_ = " +
				" (select p.uid_ from edo_project p where p.pid = '"+pid+"' and p.name_ = '里程碑计划') " +
				" and t.outlinelevel_ = '3' and t.milestone_ = '1' order by t.id_ ";
		}else if(typeStr.equals("火电项目新")){
			sql1 = "select to_char(rownum) li_id,t.name_ li_name from edo_task t where t.projectuid_ = " +
			" (select p.uid_ from edo_project p where p.pid = '"+pid+"' and p.name_ = '里程碑计划') " +
			" and t.outlinenumber_ like '%1.1.%' or t.outlinenumber_ like '%1.3.%'" +
			" and t.outlinelevel_ = '3' and t.milestone_ = '1' order by t.id_ ";
		}else{
			sql1 = "select t1.property_code li_id,t1.property_name li_name,t1.type_name from PROPERTY_CODE t1 " +
					" where  t1.type_name =(select t.uids from PROPERTY_TYPE t where type_name='"+typeStr+"')" +
					" order by to_number(t1.property_code)";		
		}
		StringBuffer sbf = new StringBuffer("{lichengbei : [");
		List<Map<String, String>> list = JdbcUtil.query(sql1);
		for (int i = 0; i < list.size(); i++) {
			Map<String, String> map = list.get(i);
			sbf.append("{");
			sbf.append("id : '"+(i+1)+"', ");
			sbf.append("name : '"+map.get("LI_NAME")+"' ");
			sbf.append("}");
			if ((list.size() - i) != 1)
				sbf.append(",");
		}
		sbf.append("]");
		sbf.append("}");
		return sbf.toString();
	}
	
   /**
	* 基建项目概况首页取数
	* @param pid
	* @return
	* @author zhangh 2012-06-06
	*/
	@SuppressWarnings("unchecked")
	public List getProItemIndexData(String pid) {
		PcZhxxProIndex pcZhxxProIndex = new PcZhxxProIndex();
        Map<String,Double> map;
        Map<Number,Double> map1;
        Map<Number,Double> map2;
        List<PcZhxxProIndex> listAll = new ArrayList<PcZhxxProIndex>();
        DecimalFormat df0 = new DecimalFormat("#");
		//获取系统时间
		Date date = new Date();
	    SimpleDateFormat yearFormat = new SimpleDateFormat("yyyy");
	    SimpleDateFormat yearMonth = new SimpleDateFormat("yyyyMM");
	    SimpleDateFormat monthFormat = new SimpleDateFormat("MM");
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss");
		String year = yearFormat.format(date);
		String yearMonth1 = yearMonth.format(date);
		//获取上一个月
		String yearLastMonth = yearMonth.format(date);

		Integer lastMonth = Integer.parseInt(monthFormat.format(date)) - 1;
		if(lastMonth == 0){
			Integer yearLastMonthInt = (Integer.parseInt(year)-1);
			yearLastMonth = yearLastMonthInt.toString()+"12";
		}else{
			String lastMonthStr = lastMonth > 9 ? lastMonth.toString() : "0"+lastMonth.toString();
			yearLastMonth = year + lastMonthStr;
		}
		//根据Pid获取项目单位相关数据项
        List<PcZhxxPrjInfo> list = zhxxDAO.findByWhere2(com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo.class.getName(),"pid ='"+pid+"'");
		PcZhxxPrjInfo pcZhxxPrjInfo = list.get(0);
		//处理总工期及倒计时数据
		String buildStart1;
		String buildEnd1 ;
		if(pcZhxxPrjInfo.getBuildStart()==null){
			buildStart1 = df.format(date);
		}else{
			buildStart1 = df.format(pcZhxxPrjInfo.getBuildStart());
		}
		if(pcZhxxPrjInfo.getBuildEnd()==null){
			buildEnd1  = df.format(date);
		}else{
			buildEnd1  = df.format(pcZhxxPrjInfo.getBuildEnd());
		}
		String tadayTime1 = df.format(date);
		//处理建设规模
		String momeC2 = pcZhxxPrjInfo.getMemoC2();
		String momeC4 = pcZhxxPrjInfo.getMemoC4();
		try{
			if(momeC2 == null){
				momeC2 = "0";
			}
			if(momeC4 == null){
				momeC4 = "0";
			}
			Double momeC21 = Double.parseDouble(momeC2); //将String转化为Doubl
			Double momeC41 = Double.parseDouble(momeC4);
			Double investScale = momeC21*momeC41;
			//在建发电项目
			pcZhxxProIndex.setPrjName(pcZhxxPrjInfo.getPrjName());
			//建设规模
			pcZhxxProIndex.setBuildScale(investScale);
			//投资规模
			if(pcZhxxPrjInfo.getInvestScale()==null){
				pcZhxxProIndex.setInvestScale(0.00);
			}else{
			    pcZhxxProIndex.setInvestScale((Double.parseDouble(pcZhxxPrjInfo.getInvestScale())/10000));
			}
			//开工日期年-月
			String buildStarrYearString;
			String buildStarrMonthString ;
			if(pcZhxxPrjInfo.getBuildStart() == null){
				buildStarrYearString = yearFormat.format(date);
				buildStarrMonthString =  monthFormat.format(date);
			}else{
				buildStarrYearString = yearFormat.format(pcZhxxPrjInfo.getBuildStart());
				buildStarrMonthString =  monthFormat.format(pcZhxxPrjInfo.getBuildStart());
			}
			pcZhxxProIndex.setBuildStart(buildStarrYearString);
			pcZhxxProIndex.setBuildStartMonth(buildStarrMonthString);
			//预计完工日期年-月
			String buildEndYearString;
			String buildEndMonthString ;
			if(pcZhxxPrjInfo.getBuildEnd() == null){
				buildEndYearString = yearFormat.format(date);
				buildEndMonthString =  monthFormat.format(date);
			}else{
				buildEndYearString = yearFormat.format(pcZhxxPrjInfo.getBuildEnd());
				buildEndMonthString =  monthFormat.format(pcZhxxPrjInfo.getBuildEnd());
			}
			pcZhxxProIndex.setBuildEnd(buildEndYearString);
			pcZhxxProIndex.setBuildEndMonth(buildEndMonthString);
			//概算总金额
//			if(pcZhxxPrjInfo.getPrjType() != null && pcZhxxPrjInfo.getPrjType().equals("GF")){
				String sql_zxbdg = "select nvl(t.zx_bdg, 0) as zxbdg from PC_TZGK_MONTH_COMP_DETAIL t " +
						" where t.unit_id = '"+pid+"' and t.sj_type = (select max(m.sj_type) from pc_tzgl_month_comp_m m " +
						" where m.report_status in ('1', '3') and m.unit_Id = '"+pid+"')";
				List zxbdg = JdbcUtil.query(sql_zxbdg);
				if(zxbdg.size()==0){
					pcZhxxProIndex.setBdgTotalMoney(0.00);
				}else{
					map1 =(Map<Number, Double>) zxbdg.get(0);
					Object totalinvestment1 = map1.get("zxbdg");
					Double totalinvestment = Double.parseDouble(totalinvestment1.toString());
					pcZhxxProIndex.setBdgTotalMoney(totalinvestment);
				}
//			}else{
//				String sqlBdg = "select  nvl(t.bdgmoney,0) as bdgmoney from bdg_info t where t.pid='"+pid+"' and   t.parent='0'";
//				List bdgMoney = JdbcUtil.query(sqlBdg);
//				if(bdgMoney.size()==0){
//					pcZhxxProIndex.setBdgTotalMoney(0.00);
//				}else{
//					map1 = (Map<Number,Double>)bdgMoney.get(0);
//					Object bdgTotalMoney1 = map1.get("bdgmoney");
//					pcZhxxProIndex.setBdgTotalMoney((Double.parseDouble(bdgTotalMoney1.toString())/10000));
//			  }
//			}
			//获取本年投资完成金额,自本年1月到当前月
//			String sql_this_year = "select nvl(sum(t.month_comp),0) as monthComp " +
//					" from pc_tzgk_month_comp_detail t " +
//					" where t.unit_id='" + pid + "' and t.sj_type in " +
//					" (select m.sj_type from pc_tzgl_month_comp_m m " +
//					" where m.pid = '" + pid + "' and m.report_status in ('1','3') " +
//					" and substr(m.sj_type,0,4) = '" + year + "')";
			
			String sql_this_year = "select nvl(t.YEAR_COMP, 0) as monthComp from PC_TZGK_MONTH_COMP_DETAIL t " +
					" where t.unit_id = '"+pid+"' and t.sj_type = (select max(m.sj_type) from pc_tzgl_month_comp_m m " +
					" where m.report_status in ('1', '3') and m.unit_Id = '"+pid+"')";
			List yearTzTotalMoney1 = JdbcUtil.query(sql_this_year);
			if(yearTzTotalMoney1.size() == 0){
				pcZhxxProIndex.setYearTzTotalMoney(0d);
			}else{
				map =(Map) yearTzTotalMoney1.get(0);
				Object monthComp =  map.get("monthComp");
				Double yearTzTotalMoney  = Double.parseDouble(monthComp.toString());
				pcZhxxProIndex.setYearTzTotalMoney(yearTzTotalMoney);
			}
	        //获取本年付款金额，自本年1月到当前月
	        //“本年付款金额”最新月度的投资完成月度报表中进行取数，字段取值“本年支出”。zhangh 2013-11-27 BUG5075
//	        if(pcZhxxPrjInfo.getPrjType() !=null && pcZhxxPrjInfo.getPrjType().equals("GF")){
	        	String yearTotalPayMoney1 = "select nvl(t.year_out, 0) as yearOut from PC_TZGK_MONTH_COMP_DETAIL t " +
						" where t.unit_id = '"+pid+"' and t.sj_type = (select max(m.sj_type) from pc_tzgl_month_comp_m m " +
						" where m.report_status in ('1', '3') and m.unit_Id = '"+pid+"')";
				List yearOut = JdbcUtil.query(yearTotalPayMoney1);
				if(yearOut.size()==0){
					pcZhxxProIndex.setYearTotalPayMoney(0d);
				}else{
					Map m = (Map) yearOut.get(0);
					BigDecimal yearTotalPayMoney = ((BigDecimal) m.get("yearOut")).setScale(0, BigDecimal.ROUND_HALF_UP);
					pcZhxxProIndex.setYearTotalPayMoney(Double.parseDouble(yearTotalPayMoney+""));
				}
//	        }else{
//		        List yearTotalPayMoney1 = JdbcUtil.query("select nvl(sum(t.paymoney),0) as payMoneyAll  from con_pay t where t.billstate = '1' and t.pid='"+pid+"' and to_char(t.paydate,'yyyy') = '"+year+"'");
//		        Map m = (Map) yearTotalPayMoney1.get(0);
//				BigDecimal yearTotalPayMoney = ((BigDecimal) m.get("payMoneyAll")).divide(new BigDecimal(10000)).setScale(0, BigDecimal.ROUND_HALF_UP);
//				pcZhxxProIndex.setYearTotalPayMoney(Double.parseDouble(yearTotalPayMoney+""));
//	        }
	        //获取本月资金到位
	        //String month_in_sj_type = "Select m.sj_type, m.pid from pc_tzgl_month_comp_m m  where m.report_status in ('1', '3') and m.pid='"+pid+"' and m.sj_type='"+yearLastMonth+"' ";
	        //String sql_month_in = "select nvl(t.month_in,0) as monthin from pc_tzgk_month_comp_detail t,("+month_in_sj_type+") tt where t.unit_id='"+pid+"' and t.sj_type = '"+yearLastMonth+"' and t.sj_type=tt.sj_type";
	        String sql_month_in = "select nvl(t.month_in, 0) as monthin from PC_TZGK_MONTH_COMP_DETAIL t " +
				" where t.unit_id = '"+pid+"' and t.sj_type = (select max(m.sj_type) from pc_tzgl_month_comp_m m " +
				" where m.report_status in ('1', '3') and m.unit_Id = '"+pid+"')";
	        List monthMoneyIn1 = JdbcUtil.query(sql_month_in);
	        Double monthMoneyIn;
	        if(monthMoneyIn1.size()==0){
	        	monthMoneyIn=0.0;
	        	pcZhxxProIndex.setMonthMoneyIn(monthMoneyIn);
	        }else{
	        	Map m = (Map) monthMoneyIn1.get(0);
				BigDecimal monthMoneyIn2 = ((BigDecimal) m.get("monthin")).setScale(0, BigDecimal.ROUND_HALF_UP);
				pcZhxxProIndex.setMonthMoneyIn(Double.parseDouble(monthMoneyIn2+""));
	        }
	        //获取总工期及倒计时间
			try {
				Long buildStare = df.parse(buildStart1).getTime();
				Long buildEnd = df.parse(buildEnd1).getTime();
				Long tadayTime = df.parse(tadayTime1).getTime();
				Long totalDateNum = (buildEnd-buildStare)/((1000 * 60 * 60 * 24));
				Long finishDateNum = (buildEnd-tadayTime)/((1000 * 60 * 60 * 24));
				pcZhxxProIndex.setTotalDateNum(totalDateNum.intValue());
				if(finishDateNum<0){
					pcZhxxProIndex.setTitleText("该项目已完工（天）");
					pcZhxxProIndex.setFinishDateNum(0);
				}else{
					pcZhxxProIndex.setTitleText("离完工还有（天）");
				    pcZhxxProIndex.setFinishDateNum(finishDateNum.intValue());
				    
				}
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return null;
			}
			//设置上月数据完整性考核分数
			HashMap<String, String> mapScore = new HashMap<String, String>();
			mapScore.put("unitid", pid);
			mapScore.put("date", yearLastMonth);
			List listScore = pcDynamicDataService.getDynamicDataByTimeAndPid("", 0, 0, mapScore);
			Double score = 0.0;
			if(listScore.size()>0){
				PcDynamicIndex rec = (PcDynamicIndex) listScore.get(0);
				//获取总分
				Boolean  flag = rec.getBasicState().equals("未审核") || 
								rec.getBidState().equals("未审核") ||
								rec.getBdgState().equals("未审核") ||
								rec.getConState().equals("未审核") ||
								rec.getScheduleState().equals("未审核") ||
								rec.getStatementState().equals("未审核") ||
								rec.getQualityState().equals("未审核 ");
				             
				if(!flag){
					score =
					(rec.getBasicState().equals("完整") ? 1 : 0 ) * (rec.getBasicValue()) +
					(rec.getBidState().equals("完整") ? 1 : 0 ) * (rec.getBidValue()) +
					(rec.getBdgState().equals("完整") ? 1 : 0 ) * (rec.getBdgValue()) +
					(rec.getConState().equals("完整") ? 1 : 0 ) * (rec.getConValue()) +
					(rec.getScheduleState().equals("完整") ? 1 : 0 ) * (rec.getScheduleValue()) +
					(rec.getStatementState().equals("完整") ? 1 : 0 ) * (rec.getStatementValue()) +
					(rec.getQualityState().equals("完整") ? 1 : 0 ) * (rec.getQualityValue()); 
				}
			}
			pcZhxxProIndex.setLastMonthNum(score);
			
			//合同签订总金额
			List conMoney1 = JdbcUtil.query("select nvl(sum(t.convaluemoney),0) as convaluemoney from v_con t where t.pid='"+pid+"'");
   	        map1 = (Map)conMoney1.get(0);
   	        Object conTotalMoney1 = map1.get("convaluemoney");
   	        Double conTotalMoney = Double.parseDouble(conTotalMoney1.toString());
   	        pcZhxxProIndex.setConTotalMoney((conTotalMoney/10000));
   	        
   	        //自开工累计投资完成
//			String sql_total = "select nvl(sum(t.total_comp),0) as monthcompall " +
//					" from pc_tzgk_month_comp_detail t ," +
//					" (select max(m.sj_type) as maxsj_type from pc_tzgl_month_comp_m m " +
//					" where m.pid = '" + pid + "' and m.report_status in ('1','3') ) tt"+
//					" where t.unit_id='" + pid + "' and t.sj_type=tt.maxsj_type " ;
			
			String sql_total = "select nvl(t.total_comp, 0) as monthcompall from PC_TZGK_MONTH_COMP_DETAIL t " +
					" where t.unit_id = '"+pid+"' and t.sj_type = (select max(m.sj_type) from pc_tzgl_month_comp_m m " +
					" where m.report_status in ('1', '3') and m.unit_Id = '"+pid+"')";
			
   	        List monthCompAll  =  JdbcUtil.query(sql_total);
   	        if(monthCompAll.size() == 0){
   	        	pcZhxxProIndex.setAllTzTotalMoney(0d);
   	        }else{
   	        	map1 = (Map)monthCompAll.get(0);
   	        	Object allTzTotalMoney1 = map1.get("monthcompall");
   	        	Double conTotalMoney2 = Double.parseDouble(allTzTotalMoney1.toString());
//		    	conTotalMoney2 = conTotalMoney2/10000;
   	        	pcZhxxProIndex.setAllTzTotalMoney(conTotalMoney2);
   	        }
		    
		    //自开工累计付款金额
		    //“自开工累计付款金额”字段取值“累计支出”。
//		    if(pcZhxxPrjInfo.getPrjType()!=null && pcZhxxPrjInfo.getPrjType().equals("GF")){
//		    	String sql = "select nvl(sum(t.total_out),0) as totalComp from PC_TZGK_MONTH_COMP_DETAIL t " +
//						" where t.unit_id = '"+pid+"' and t.master_id in (select uids from pc_tzgl_month_comp_m m " +
//						" where m.report_status in ('1', '3') and m.unit_Id = '"+pid+"')";
   	       if("1032102".equals(pid)){//国峰项目已付款金额
	   	    	String sql = "select nvl(sum(t.conpay), 0) as totalComp from v_con t where t.pid='"+pid+"'";
				List totalComp = JdbcUtil.query(sql);
				if(totalComp.size()==0){
					pcZhxxProIndex.setAllTotalPayMoney(0.00);
				}else{
					Map m = (Map) totalComp.get(0);
					BigDecimal allTotalPayMoney = ((BigDecimal)m.get("totalComp")).divide(new BigDecimal(10000)).setScale(2, BigDecimal.ROUND_HALF_UP);
					pcZhxxProIndex.setAllTotalPayMoney(Double.parseDouble(allTotalPayMoney+""));
				}
   	       }else{
		    	String sql = "select nvl(t.total_out, 0) as totalComp from PC_TZGK_MONTH_COMP_DETAIL t " +
						" where t.unit_id = '"+pid+"' and t.sj_type = (select max(m.sj_type) from pc_tzgl_month_comp_m m " +
						" where m.report_status in ('1', '3') and m.unit_Id = '"+pid+"')";
				List totalComp = JdbcUtil.query(sql);
				if(totalComp.size()==0){
					pcZhxxProIndex.setAllTotalPayMoney(0.00);
				}else{
					Map m = (Map) totalComp.get(0);
					BigDecimal allTotalPayMoney = ((BigDecimal)m.get("totalComp")).setScale(0, BigDecimal.ROUND_HALF_UP);
					pcZhxxProIndex.setAllTotalPayMoney(Double.parseDouble(allTotalPayMoney+""));
				}
//		    }else{
//			    List  payMoneYAll = JdbcUtil.query("select nvl(sum(t.paymoney),0) as paymoneyall from con_pay t where t.billstate = '1' and t.pid='"+pid+"'");
//			    Map m = (Map) payMoneYAll.get(0);
//				BigDecimal allTotalPayMoney = ((BigDecimal)m.get("paymoneyall")).divide(new BigDecimal(10000)).setScale(0, BigDecimal.ROUND_HALF_UP);
//				pcZhxxProIndex.setAllTotalPayMoney(Double.parseDouble(allTotalPayMoney+""));
//		    }
   	       }
		    //自开工累计资金到位
		    String all_Total_Money_In1_sj_type = "Select max(m.sj_type) as maxsj_type from pc_tzgl_month_comp_m m  where m.report_status in ('1', '3') and m.pid='"+pid+"' ";
		    String sql_all_Total_Money_In1 = "select nvl(sum(t.total_in),0) as monthin from pc_tzgk_month_comp_detail t,("+all_Total_Money_In1_sj_type+") tt where t.unit_id='"+pid+"' and t.sj_type=tt.maxsj_type";
	        List allTotalMoneyIn1 = JdbcUtil.query(sql_all_Total_Money_In1);
	        Double allTotalMoneyIn = 0.0;
	        if(allTotalMoneyIn1.size() > 0){
	        	map1 = (Map<Number,Double>)allTotalMoneyIn1.get(0);
	        	Object allTotalMoneyIn2 = map1.get("monthin");
	        	allTotalMoneyIn = Double.parseDouble(allTotalMoneyIn2.toString());
	        }
	        pcZhxxProIndex.setAllTotalMoneyIn(allTotalMoneyIn);
	        
	        //本月签订合同金额及数量
   	        String conMonthTzTotalMonthString =  monthFormat.format(date);
			List conMonthMoneyl = JdbcUtil.query("select nvl(sum(t.conmoney),0) as conmoney,count(conid) as num from con_ove t where t.pid='"+pid+"' and to_char(signdate,'yyyy') = '"+year+"' and to_char(signdate,'MM')= '"+conMonthTzTotalMonthString+"'");
   	        if(conMonthMoneyl.size() == 0){
   	        	pcZhxxProIndex.setConMonthMoney(0d);   	        
   	        	pcZhxxProIndex.setConMonthMoneyNum(0d);
   	        }else{
   	        	map1 = (Map)conMonthMoneyl.get(0);
   	        	Object conMonthMoneyo = map1.get("conmoney");
   	        	Object conMonthMoneyonum=map1.get("num");
   	        	Double conMonthMoney = Double.parseDouble(conMonthMoneyo.toString());
   	        	Double conMonthMoneyNum=Double.parseDouble(conMonthMoneyonum.toString());
   	        	pcZhxxProIndex.setConMonthMoney((conMonthMoney/10000));   	        
   	        	pcZhxxProIndex.setConMonthMoneyNum(conMonthMoneyNum);
   	        }
   	        
   	        
			//自开工累计签订合同金额及个数
			List conTotalMoneyl = JdbcUtil.query("select nvl(sum(t.conmoney),0) as conmoney,count(conid) as num from con_ove t where t.pid='"+pid+"'");
   	        map1 = (Map)conTotalMoneyl.get(0);
   	        if(conTotalMoneyl.size() == 0){
   	        	pcZhxxProIndex.setAllTotalConMoney(0d);   	        
   	        	pcZhxxProIndex.setAllTotalConMoneyNum(0d); 
   	        }else{
   	        	Object conTotalMoneyo = map1.get("conmoney");
   	        	Object conTotalMoneyonum=map1.get("num");
   	        	Double conTotalAllMoney = Double.parseDouble(conTotalMoneyo.toString());
   	        	Double conTotalMoneyNum=Double.parseDouble(conTotalMoneyonum.toString());
   	        	pcZhxxProIndex.setAllTotalConMoney((conTotalAllMoney/10000));   	        
   	        	pcZhxxProIndex.setAllTotalConMoneyNum(conTotalMoneyNum);  	        
   	        }
   	        
   	        
   	        
		    //本月合同付款金额及个数
   	        String payTzTotalMonthString =  monthFormat.format(date);
   	        String sqlPayMonthJinE_="select nvl(sum(t.paymoney),0) as paymoneyMonth,count(payid) as num from con_pay t where  t.pid='"+pid+"' and to_char(t.paydate,'yyyy') = '"+year+"' and to_char(t.paydate,'MM')= '"+payTzTotalMonthString+"'  and t.conid in(select conid from con_ove)";
   	        String 	sqlPayMonthGeSHU_="select count(distinct(t.conid)) as num from con_ove t where t.pid='"+pid+"' and t.conid in(select p.conid from con_pay p  where to_char(p.paydate,'yyyy')= '"+year+"' and to_char(p.paydate,'MM')= '"+payTzTotalMonthString+"')";
		    List  conMonthPayMoneyl= JdbcUtil.query(sqlPayMonthJinE_);
		    List  conMonthPayMoney2= JdbcUtil.query(sqlPayMonthGeSHU_);
		    map1 = (Map)conMonthPayMoneyl.get(0);
		    map2 = (Map)conMonthPayMoney2.get(0);
		    Object payMoney1 = map1.get("paymoneyMonth");
		    Object payMoneylnum=map2.get("num");
		    Double payMonthMoney = Double.parseDouble(payMoney1.toString());
		    Double payMoneynum=Double.parseDouble(payMoneylnum.toString());
		    pcZhxxProIndex.setMonthPayMoney((payMonthMoney/10000));
		    pcZhxxProIndex.setMonthPayMoneyNum(payMoneynum);
		    
		    //自开工累计付款个数
		    List  payMoneyTotal = JdbcUtil.query("select nvl(sum(t.paymoney),0) as paymoneyall,count(payid) as num from con_pay t where  t.pid='"+pid+"'");
		    map1 = (Map)payMoneyTotal.get(0);
		    Object allTotalPayMoneyNum1 = map1.get("num");
		    Object allTotalPay= map1.get("paymoneyall");
		    Double allTotalPay_ = Double.parseDouble(allTotalPay.toString());
		    Double allTotalPayMoneyNum = Double.parseDouble(allTotalPayMoneyNum1.toString());
		    pcZhxxProIndex.setAllTotalPayMoneyNum(allTotalPayMoneyNum);
//		    pcZhxxProIndex.setAllTotalPayMoney(allTotalPay_/10000);

		    
		    //本月合同变更金额及个数
   	        String changeTzTotalMonthString =  monthFormat.format(date);
		    List  conMonthChangeMoneyl= JdbcUtil.query("select nvl(sum(t.chamoney),0) as changemoneyMonth,count(chaid) as num from con_cha t where  t.pid='"+pid+"' and to_char(t.chadate,'yyyy') = '"+year+"' and to_char(t.chadate,'MM')= '"+payTzTotalMonthString+"'  and t.conid in(select conid from con_ove)");
		    List  conMonthChangeMoney2= JdbcUtil.query("select count(distinct(t.conid)) as num from con_ove t where t.pid='"+pid+"'  and t.conid in(select p.conid from con_cha p  where to_char(p.chadate,'yyyy')= '"+year+"' and to_char(p.chadate,'MM')= '"+payTzTotalMonthString+"')");
		    if(conMonthChangeMoneyl.size() == 0){
		    	pcZhxxProIndex.setConMonthChangeMoney(0d);
		    }else{
		    	map1 = (Map)conMonthChangeMoneyl.get(0);
		    	Object changeMoney1 = map1.get("changemoneyMonth");
		    	Double changeMonthMoney = Double.parseDouble(changeMoney1.toString());
		    	pcZhxxProIndex.setConMonthChangeMoney((changeMonthMoney/10000));
		    }
		    
		    if(conMonthChangeMoney2.size() == 0){
		    	pcZhxxProIndex.setConMonthChangeMoneyNum(0d);
		    }else{
		    	map2 = (Map)conMonthChangeMoney2.get(0);
			    Object changeMoneylnum=map2.get("num");
			    Double changeMoneynum=Double.parseDouble(changeMoneylnum.toString());
			    pcZhxxProIndex.setConMonthChangeMoneyNum(changeMoneynum);
		    }
		    
		    //自开工累计合同变更金额及个数
		    List  conChangeMoneyl= JdbcUtil.query("select nvl(sum(t.chamoney),0) as changemoney,count(chaid) as num from con_cha t where  t.pid='"+pid+"'");
		    if(conChangeMoneyl.size() == 0){
		    	pcZhxxProIndex.setAllTotalChangeMoney(0d);
			    pcZhxxProIndex.setAllTotalChangeMoneyNum(0d);	
		    }else{
		    	map1 = (Map)conChangeMoneyl.get(0);
			    Object changeAllMoney1 = map1.get("changemoney");
			    Object changeAllMoneylnum=map1.get("num");
			    Double changeAllMoney = Double.parseDouble(changeAllMoney1.toString());
			    Double changeAllnum=Double.parseDouble(changeAllMoneylnum.toString());
			    pcZhxxProIndex.setAllTotalChangeMoney((changeAllMoney/10000));
			    pcZhxxProIndex.setAllTotalChangeMoneyNum(changeAllnum);	
		    }
		    //项目质量总目标  yanglh 2014-02-10
		    String prjQualityTarget = pcZhxxPrjInfo.getPrjQualityTarget();
		    System.out.println("prjQualityTarget="+prjQualityTarget);
		    if(prjQualityTarget != null){
		    	String strValue = "";
		    	String whereSql = "  in (";
		    	String[] value = prjQualityTarget.split("、");
		    	for(int ii = 0; ii < value.length; ii ++){
		    		if(value.length == 1){
		    			whereSql += "'"+value[ii]+"'";
		    		}else{
		    			if(ii == 0 || ii == value.length){
		    				whereSql += "'"+value[ii]+"'";
		    			}else{
		    				whereSql += ",'"+value[ii]+"'";
		    			}
		    		}
		    	}
		    	whereSql += ")";
		    	List  getList = JdbcUtil.query("select tt.property_name from property_code tt where " +
		    			"tt.type_name=(select uids from property_type t where t.type_name = '项目质量总目标') and tt.property_code "+whereSql+" order by property_code asc");
		    	Map<String,String> mapValue;
		    	if(getList.size()>0){
		    		for(int kk = 0; kk < getList.size(); kk ++){
		    			mapValue = (Map<String, String>) getList.get(kk);
			    		if(getList.size() == 1){
			    			strValue = mapValue.get("PROPERTY_NAME");
			    		}else{
			    			if(kk == 0 || kk == value.length){
			    				strValue += mapValue.get("PROPERTY_NAME");
			    			}else{
			    				strValue += "、"+mapValue.get("PROPERTY_NAME");
			    			}
			    		}
		    			pcZhxxProIndex.setPrjQualityTarget(strValue);
		    		}
		    	}
		    }
	        
		}catch(NumberFormatException e) {
			e.printStackTrace();
			return null;
		}
   		listAll.add(pcZhxxProIndex);
		return listAll;
	}
	
	
	@SuppressWarnings("unchecked")
	public String addDydaAfterSaveOrUpdateSgcc(String pid, String[] idsOfAll, String toUnit, String fromUnit)
	{
		String flag = "0";
		
		if(null==idsOfAll || idsOfAll.length==0)
		{
			flag = "1";
		}
		else
		{
			Session session = this.zhxxDAO.getSessionFactory().openSession();
			List list = new ArrayList();
			for(int i=0; i<idsOfAll.length; i++)
			{
				  SgccIniUnit sgccBean = (SgccIniUnit) this.zhxxDAO.findById(SgccIniUnit.class.getName(), idsOfAll[i]);
				  if(sgccBean != null)
				  {
					  PcDynamicData dyda = new PcDynamicData();
					  dyda.setPid(pid);
					  dyda.setPctablebean(SgccIniUnit.class.getName());
					  dyda.setPctablename("SGCC_INI_UNIT");
					  dyda.setPctableoptype(DynamicDataUtil.OP_UPDATE);
					  dyda.setPctableuids(idsOfAll[i]);
					  dyda.setPcdynamicdate(new Date());
					  dyda.setPcurl(DynamicDataUtil.PROJECT_UNITSTRUCTURE_URL);
					  
					  session.beginTransaction();
					  session.save(dyda);
					  
					  list.add(dyda);
					  list.add(sgccBean);
				  }
			}
		    session.getTransaction().commit();
		    session.close();
		    
			PCDataExchangeService excService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List<PcDataExchange> exchangeList = 
								excService.getExcDataList(list, toUnit, fromUnit, null, null, "项目单位组织机构变更");
			
			Map<String,String> rtnMap = excService.sendExchangeData(exchangeList);
			if(rtnMap.get("result").equals("success")){
				flag = "1";	
			}else{
				flag = "0";//报送失败s
			}
		}
		
		return flag;
	}
	
	/**
	 * 计算某个项目单位上月数据完整性考核分数
	 * @param pid
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getLastMonthNum(String unitid) {
		String rtnStr = "0"; //初始化为评分为0
		
		Date date = new Date();
	    SimpleDateFormat yearFormat = new SimpleDateFormat("yyyy");
	    SimpleDateFormat monthFormat = new SimpleDateFormat("MM");
	    int year = Integer.parseInt(yearFormat.format(date));
	    int month = Integer.parseInt(monthFormat.format(date)) - 1;
	    
	    String sjType = String.valueOf(year) + (month>=10 ? String.valueOf(month):"0" + String.valueOf(month)); 
	    if(0 == month)
	    {
	    	 sjType = String.valueOf(year-1) + "12";
	    }
		
		HashMap<String, String> mapScore = new HashMap<String, String>();
		mapScore.put("unitid", unitid);
		mapScore.put("date", sjType);
		List<PcDynamicIndex> recs = pcDynamicDataService.getDynamicDataByTimeAndPid("", 0, 0, mapScore);
		int count = 0;
		Double totalScore = 0.0;
		for(int i=0; i<recs.size(); i++) {
			PcDynamicIndex pdi = recs.get(i);
			Boolean flag = pdi.getBasicState().equals("未审核") || pdi.getBidState().equals("未审核") 
            			   || pdi.getBdgState().equals("未审核") || pdi.getConState().equals("未审核") 
            			   || pdi.getScheduleState().equals("未审核") || pdi.getStatementState().equals("未审核") 
            			   || pdi.getQualityState().equals("未审核 ");
			if(!flag) {
				count++;
				totalScore += (pdi.getBasicState().equals("完整") ? 1 : 0 ) * (pdi.getBasicValue()) +
							  (pdi.getBidState().equals("完整") ? 1 : 0 ) * (pdi.getBidValue()) +
							  (pdi.getBdgState().equals("完整") ? 1 : 0 ) * (pdi.getBdgValue()) +
							  (pdi.getConState().equals("完整") ? 1 : 0 ) * (pdi.getConValue()) +
							  (pdi.getScheduleState().equals("完整") ? 1 : 0 ) * (pdi.getScheduleValue()) +
							  (pdi.getStatementState().equals("完整") ? 1 : 0 ) * (pdi.getStatementValue()) +
							  (pdi.getQualityState().equals("完整") ? 1 : 0 ) * (pdi.getQualityValue());
			}
		}
		
		if(count != 0) {
			rtnStr = String.valueOf(new java.text.DecimalFormat("0").format(totalScore/count));
		} 
		
		return rtnStr;
	}
	
	/**
	 * 多个项目单位审核评分的平均值（审核评分之和/有审核评分的项目单位个数）
	 * @param pids
	 * @return
	 */
	public String getLastMonthNums(String[] pids) {
		int base = pids.length;
		
		if(null==pids || 0==pids.length){
			return "0";
		}
		else
		{
			int totalScore = 0;
			for(int i=0; i<pids.length; i++)
			{
				String score = getLastMonthNum(pids[i]);
				
				if(score.equals("none")) {
					base--;
				}
				else
				{
					totalScore += Integer.valueOf(score);
				}
			}
			
			if(base>0) {
				return String.valueOf(totalScore/base);
			}
			else
			{
				return "0";
			}
		}
	}
	
	/**
	 * 判断一个项目单位的某个月份是否有审核评分
	 * @param pid
	 * @param sjType
	 * @return
	 */
	private Boolean isHaveAuditScore(String unitid, String sjType)
	{
		HashMap<String, String> mapScore = new HashMap<String, String>();
		mapScore.put("unitid", unitid);
		mapScore.put("time", sjType);
		List listScore = pcDynamicDataService.getDynamicDataByTimeAndPid("", 0, 0, mapScore);
		
		if(listScore.size()>0){
			PcDynamicIndex rec = (PcDynamicIndex) listScore.get(0);
			//获取总分
			Boolean  flag = rec.getBasicState().equals("未审核") || 
							rec.getBidState().equals("未审核") ||
							rec.getBdgState().equals("未审核") ||
							rec.getConState().equals("未审核") ||
							rec.getScheduleState().equals("未审核") ||
							rec.getStatementState().equals("未审核") ||
							rec.getQualityState().equals("未审核 ");
			
			if(flag) {
				return false;         //没有审核评分
			}
			else {
				return true;         //有审核评分
			}
		}
		else
		{
			return false;           
		}
	}
	/**
	 * 
	* @Title: initBaseInfoD
	* @Description: 初始化项目基本情况,一个项目一张报表
	* @param pid
	* @param idsOfInsert   
	* @return void    
	* @throws
	* @author qiupy 2014-7-16
	 */
	public void initBaseInfoD(String pid,String idsOfInsert){
		String sql="select info.PRJ_NAME," +
		"(select sgcc.UNITNAME from SGCC_INI_UNIT sgcc where sgcc.UNITID=info.memo_c1) BUILD_UNIT, " +
		"(select MAX(property_name) from v_property t1 where  T1.TNAME='建设规模单位' AND T1.PROPERTY_CODE=info.GUI_MO_DW) BUILD_GUIMO_DW,"+
		"info.MEMO_C2||'X'||info.MEMO_C4 as BUILD_GUIMO_GM,"+
		"info.PRJ_ADDRESS||'省'||info.MEMO_C3 as BUILD_ADDRESS,"+
		"(select MAX(property_name) from v_property t1 where  T1.TNAME='建设性质' AND T1.PROPERTY_CODE=info.BUILD_NATURE) BUILD_NATURE,"+
		"info.BUILD_LIMIT,"+
		"( select round(nvl(sum(s4.amount),0)/10000,2) from pc_zhxx_prj_fundsrc s4 where s4.pid = info.pid and s4.src_type = 'DK' ) src_dk,"+
		"( select round(nvl(sum(s5.amount),0)/10000,2) from pc_zhxx_prj_fundsrc s5 where s5.pid = info.pid and s5.src_type = 'QT' ) src_qt,"+
		"( select round(nvl(sum(s6.amount),0)/10000,2) from pc_zhxx_prj_fundsrc s6 where s6.pid = info.pid and s6.src_type in ( 'ZBJJT', 'ZBJZY','ZBJQT' )  ) src_zbj_total ,"+
		"( select round(nvl(sum(s7.amount),0)/10000,2) from pc_zhxx_prj_fundsrc s7 where s7.pid = info.pid and s7.src_type in ( 'ZBJJT', 'ZBJZY','ZBJQT', 'DK', 'QT' )  ) invest_total"+ 
		" from PC_ZHXX_PRJ_INFO info where info.PID='"+pid+"'";
		List<Map> tempList=JdbcUtil.query(sql);
		if(tempList.size()>0){
			Map map=tempList.get(0);
			BigDecimal src_zbj_total=(BigDecimal)(map.get("src_zbj_total")==null ? new BigDecimal(0):map.get("src_zbj_total"));
			BigDecimal invest_total=(BigDecimal)(map.get("invest_total")==null ? new BigDecimal(0):map.get("invest_total"));
			PcProBaseInfoD temp2=new PcProBaseInfoD();
			temp2.setPid(pid);
			temp2.setPrjName(map.get("PRJ_NAME")==null?"":map.get("PRJ_NAME").toString());
			temp2.setBuildLimit(map.get("BUILD_LIMIT")==null?"":map.get("BUILD_LIMIT").toString());
			temp2.setBuildUnit(map.get("BUILD_UNIT")==null?"":map.get("BUILD_UNIT").toString());
			temp2.setBuildNature(map.get("BUILD_NATURE")==null?"":map.get("BUILD_NATURE").toString());
			temp2.setBuildGuimoDw(map.get("BUILD_GUIMO_DW")==null?"":map.get("BUILD_GUIMO_DW").toString());
			temp2.setBuildGuimoGm(map.get("BUILD_GUIMO_GM")==null?"":map.get("BUILD_GUIMO_GM").toString());
			temp2.setBuildAddress(map.get("BUILD_ADDRESS")==null?"":map.get("BUILD_ADDRESS").toString());
			temp2.setFundSourceTotalAmount(invest_total.doubleValue());
			temp2.setFundSourceZbAmount(src_zbj_total.doubleValue());
			temp2.setFundSourceDkAmount(map.get("src_dk")==null? 0d: Double.valueOf(map.get("src_dk").toString()));
			temp2.setFundSourceQtAmount(map.get("src_qt")==null?0d:Double.valueOf(map.get("src_qt").toString()));
			this.zhxxDAO.saveOrUpdate(temp2);
		}
	}
	/**
	 * 
	* @Title: deleteBaseInfoD
	* @Description: 删除项目基本情况明细
	* @param masterId
	* @param pid
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-7-16
	 */
	public String deleteBaseInfoD(String masterId,String pid){
		if(!"".equals(masterId)){
			//通过主记录主键直接删除所有明细
			this.zhxxDAO.executeHQL("delete PcProBaseInfoD as p where p.pid='"+pid+"'");
			return "1";
		}else{
			return "0";
		}
	}
	/**
	 * 
	* @Title: doProBaseInfoExchangeDataToQueue
	* @Description: 上报项目基本情况表
	* @param uids
	* @param pid
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-7-16
	 */
	public String doProBaseInfoExchangeDataToQueue(String uids,String pid){
		if(uids!=null&&uids.length()>0){
			List exchangeList=new ArrayList();
			PcProBaseInfoM baseInfoM =(PcProBaseInfoM) this.zhxxDAO.findById(PcProBaseInfoM.class.getName(), uids);
			baseInfoM.setReportStatus(1l);
			this.zhxxDAO.saveOrUpdate(baseInfoM);
			List<PcProBaseInfoD> baseInfoDList=this.zhxxDAO.findByWhere(PcProBaseInfoD.class.getName(), "pid = '" + pid + "'");
			exchangeList.add(baseInfoM);
			if(baseInfoDList!=null&&baseInfoDList.size()>0){
				exchangeList.addAll(baseInfoDList);
			}
			if ("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))) {
				PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
						.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(
						exchangeList, Constant.DefaultOrgRootID,pid,"","", "项目基本情况表上报");
				dataExchangeService.addExchangeListToQueue(ExchangeList);
			}
			return "上报成功！";
		}else{
			return "上报失败！";
		}
	}
}

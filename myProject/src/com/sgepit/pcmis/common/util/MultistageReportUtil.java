package com.sgepit.pcmis.common.util;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.hibernate.Session;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.pcmis.common.hbm.PcBusniessBack;

public class MultistageReportUtil {
	public static String getInsertSqlOfPcBusniessBack(PcBusniessBack back){
		String sql="";
		if(back !=null){
			SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			sql="insert into PC_BUSNIESS_BACK (pid,uids,busniess_id,back_user,back_date,busniess_type,spare_c1,spare_c2,back_reason)"+
			  "values('"+back.getPid()+"','"
			  +back.getUids()+"','"
			  +back.getBusniessId()+"','"
			  +back.getBackUser()+"',to_date('"
			  +sdf.format(back.getBackDate())+"','YYYY-MM-DD HH24:MI:SS'),'"
			  +back.getBusniessType()+"','"
			  +back.getSpareC1()+"','"
			  +back.getSpareC2()+"','"
			  +back.getBackReason()+"')";
		}
		return sql;
	}
	public static PcBusniessBack getInsertObjectOfPcBusniessBack(String pid,String businessId,
			String backUser,String unitname,String op,String reason,String busniessType){
		PcBusniessBack bussBack=new PcBusniessBack();
		bussBack.setPid(pid);
//		bussBack.setUids(SnUtil.getNewID());
		bussBack.setBusniessId(businessId);
		bussBack.setBackUser(backUser);
		bussBack.setBackDate(new Date());
		bussBack.setBusniessType(busniessType);
		bussBack.setSpareC1(op);
		bussBack.setSpareC2(unitname);
		bussBack.setBackReason(reason);
		return bussBack;
	}
	/**
	 * 由上级到下级
	 * @param objList
	 * @param bussBack
	 * @param unitTypeId
	 * @param toUnit
	 * @param bizInfo
	 * @return
	 */
	public static String multiReport(List<Object> objList,PcBusniessBack bussBack,String unitTypeId,String fromUnit,String toUnit,String bizInfo){
		String flag="0";
		flag=multiReport2(objList,bussBack,unitTypeId,fromUnit,toUnit,bizInfo,null,null);
		return flag;
		
	}
	
	public static String multiReport2(List<Object> objList,PcBusniessBack bussBack,
			String unitTypeId,String fromUnit,String toUnit,String bizInfo,String sqlBefore,String sqlAfter){
		String flag="0";
		BaseDAO baseDao=(BaseDAO)Constant.wact.getBean("baseDAO");
		Session session =HibernateSessionFactory.getSession();
		if(unitTypeId.equals("2")){
			if(bussBack !=null){
				bussBack.setBusniessType(bussBack.getBusniessType()+"【集团->到二级企业】");
				session.beginTransaction();
				session.update(bussBack);
				session.getTransaction().commit();
				flag="1";
			}
		//由二级企业退回到项目单位
		}else if(unitTypeId.equals("A")){
			if(bussBack !=null){
				bussBack.setBusniessType(bussBack.getBusniessType()+"【二级企业->到项目单位】");
				session.beginTransaction();
				session.update(bussBack);
				session.getTransaction().commit();
			}
			//判断是否需要数据交互
			if(baseDao.findByWhere(SgccIniUnit.class.getName(), 
					"unitid = '"+toUnit+"' and appUrl is not null").size()>0){//需要数据交互
				if(bussBack !=null)objList.add(bussBack);
				 PCDataExchangeService excService = (PCDataExchangeService)Constant.wact.getBean("PCDataExchangeService");
				 List<PcDataExchange> exchangeList=excService.getExcDataList(objList, toUnit, fromUnit,sqlBefore, sqlAfter, bizInfo);
				 Map<String,String> rtn = excService.sendExchangeData(exchangeList);
				 if(rtn.get("result").equals("success")){//发送成功
					 flag="1";
				 }else{//发送失败
				 }
			}else{//不需要数据交互
				flag="1";
			}
		}
		 session.close();
		return flag;
		
	}
	
	public static String secondReport(String bizSql,String bussbackSql){
		String flag="0";
		BaseDAO baseDao=(BaseDAO)Constant.wact.getBean("baseDAO");
		int rs=baseDao.updateBySQL(bizSql);
		if(rs>0)flag="1";
		int rs2=baseDao.updateBySQL(bussbackSql);
		if(rs2>0)flag="1";
		else flag="0";
		return flag;
	}
}

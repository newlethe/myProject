package com.sgepit.pmis.equipment.service;


import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.map.ListOrderedMap;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.equipment.dao.EquipmentDAO;
import com.sgepit.pmis.equipment.hbm.EquList;
import com.sgepit.pmis.equipment.hbm.EquRec;
import com.sgepit.pmis.equipment.hbm.EquRecSub;


public class EqurecMgmImpl extends BaseMgmImpl implements EqurecMgmFacade{
	
	private EquipmentDAO equipmentDAO;

	private String recBean = BusinessConstants.EQU_PACKAGE + BusinessConstants.EQU_REC;
	private String recSubBean = BusinessConstants.EQU_PACKAGE + BusinessConstants.EQU_REC_SUB;
	private String recListBean = BusinessConstants.EQU_PACKAGE + BusinessConstants.EQU_LIST;
	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static EqurecMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (EqurecMgmImpl) ctx.getBean("equRecMgm");
	}

	// -------------------------------------------------------------------------
	// Setter methods for dependency injection
	// -------------------------------------------------------------------------
	public void setEquipmentDAO(EquipmentDAO equipmentDAO) {
		this.equipmentDAO = equipmentDAO;
	}

	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------
	public void insertequRec(EquRec er){
		System.out.println(er);
		if(er.getPleRecdate().toString().equals("Thu Jan 01 08:00:00 CST 1970"))er.setPleRecdate(null);
		if(er.getRecdate().toString().equals("Thu Jan 01 08:00:00 CST 1970"))er.setRecdate(null);
		er.setRecno(getRecNo(er.getConid()));
		this.equipmentDAO.insert(er);
	}
	public void saveOrUpdate(EquRec er){
		if(er.getPleRecdate().toString().equals("Thu Jan 01 08:00:00 CST 1970"))er.setPleRecdate(null);
		if(er.getRecdate().toString().equals("Thu Jan 01 08:00:00 CST 1970"))er.setRecdate(null);
		this.equipmentDAO.saveOrUpdate(er);
	}
	public List equInfoGetGoods(){
		String sql = "select e.*,s.gg_total "
					+"from equ_info e,(select t.equid, sum(t.gg_num) gg_total from equ_info_get t group by t.equid) s "
					+"where e.equid = s.equid";
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List list = jdbc.queryForList(sql);
		return list;
	}
	
	//在某条领用单下新增设备或部件
	//领用数量不能大于库存数量
	public String insertRec(String recid, String[] equids, Double[] dhsls, String[] jzhs){
		String state = "";
		Date recdate = new Date();
		for (int i = 0; i < equids.length; i++) {
			String where = "equid = '" + equids[i] + "' and recid = '" + recid + "'";
			String orderby = "recid asc";
			List list1 = this.equipmentDAO.findByWhere3(recSubBean, where, orderby);		
			if (list1.isEmpty()) {
				EquRecSub ers = new EquRecSub();
				ers.setRecid(recid);
				ers.setEquid(equids[i]);
				ers.setPleRecnum(dhsls[i]);   //请领数量一开始设为与到货数量相同
				ers.setRecnum(Double.parseDouble("0")); 	 //领用数量一开始设为0
				ers.setMachineNo(jzhs[i]);
				ers.setRecdate(recdate);
				this.equipmentDAO.insert(ers);
				state = "success";
			}
			else {
				if (list1.size() == 1) {
					List list2 = this.equipmentDAO.findByProperty(recListBean, "sbId", equids[i]);
					EquList ers = (EquList)list2.get(0);
					String recSubName = ers.getSbMc();
					state = "您想要保存的设备:" + recSubName + "已存在，请选择其他设备。";
				}
				else {
					state = "您想要保存的设备已存在，请选择其他设备。";
				}	
			} 
		}
		return state;
	}
	
	//取得领用页面从表--设备与部件表的数据
	public List equRecSub(String recid){
		String sql="select m.sb_mc,m.ggxh,m.dw,m.sccj,t.ple_recnum,t.machine_no,t.recdate,t.remark,t.equid ,t.recsubid,t.recnum,n.checkdate,k.sl,n.part_no,n.boxno,n.wztype from equ_rec_sub t ,EQU_LIST m,equ_open_box n ,equ_open_box_sub k where t.equid=m.sb_id and t.equid=n.sbid and n.uuid=k.open_id and t.recid = '" + recid + "'";
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List list = jdbc.queryForList(sql);
		return list;
	}
	//取得所有待领用数据
	
	public List equRecSub2(String conid){
		String sql="select n.wztype,k.sbbmc sb_mc,k.ggxh,k.dw,k.sccj,n.checkdate,k.opensl DHSL,t.ple_recnum,t.recnum,k.jzh MACHINE_NO,n.box_no,n.paryno PART_NO,t.remark,t.equid ,t.recsubid from equ_rec_sub t,equ_open_box n ,equ_open_box_sub k where t.equid=k.sb_id and n.uuid=k.open_id and n.conid='"+conid+"' and t.recid is null";
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List list = jdbc.queryForList(sql);
		return list;
	}
	//取得按照“LY2008070001”格式自动生成的领用单编号
	public String getRecNo(String conid){
		String recNo = null;
		Calendar CD = Calendar.getInstance();
		SimpleDateFormat ftmonth = new SimpleDateFormat();
		ftmonth.applyPattern("MM");
		SimpleDateFormat ftyear = new SimpleDateFormat();
		ftyear.applyPattern("yyyy");
		String month = ftmonth.format(CD.getTime());
		String year = ftyear.format(CD.getTime());
		List list = this.equipmentDAO.findByProperty(recListBean, "conid", conid);
		if(list.size()>0){
			String sql = "select lpad(nvl(max(TO_NUMBER (substr(t.recno, length(t.recno)-3, " +
					"length(t.recno)))),0) + 1,4,0) rec_no from equ_rec t";
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			List list2 = jdbc.queryForList(sql);
			Iterator it = list2.iterator();
			while (it.hasNext()){
				Map map = (Map)it.next();
				String newno = (String)map.get("rec_no");
				recNo = "LY" + year + month + newno;
			}
		}
		return recNo;
	}
	
	//在从表中新增数据时，列出待选设备或部件的字段
	public List equGoodsSub(String conId){
		String sql = "select b.sb_id, t.sb_mc, t.ggxh, t.dw, t.zs, b.opensl dhsl, t.sx wztype, t.sccj, e.jzh "
					+"from equ_list t, equ_sbdh_arr e ,Equ_Open_Box_Sub b "
					+"where b.sb_id = t.sb_id(+) and t.parentid = e.sb_id and e.conid = '" + conId + "'";
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List list = jdbc.queryForList(sql);
		return list;
	}
	
	public void SaveRecSub2(String[] ids,String recid) throws BusinessException{
		  
		 String s[][]=new String[ids.length][];//声明一个二维数组
		  for(int i=0;i<ids.length;i++){
		   s[i]=ids[i].split(",");//按照空格拆分字符串
		   
		  }
	  	String recsunid = s[0][0];
	  	int   qlsl=Integer.parseInt(s[1][0]);
	    int   lysl=Integer.parseInt(s[2][0]);
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql2="update EQU_REC_SUB set PLE_RECNUM='"+qlsl+"',RECNUM ='"+lysl+"' where RECSUBID='"+recsunid+"'";
		jdbc.update(sql2);
	
	}
	
	public String SaveRecSub(EquRecSub sub,String Erecid){
		String state="";
		String equid = sub.getEquid();
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		Long oldrecnum=(Long)jdbc.queryForObject("select recnum from equ_rec_sub where recsubid='"+sub.getRecsubid()+"'",Long.class);
		if(!sub.getRecid().equals(""))//修改已领用设备数据
		{    
			if(sub.getPleRecnum()==0){
			//jdbc.update("update equ_rec_sub set kcsl='"+(sub.getKcsl()+oldple_recnum)+"'where equid='"+equid+"'");
			jdbc.update("delete from equ_rec_sub where recsubid='"+sub.getRecsubid()+"'");
			return state="1";
		      }
			else if (sub.getPleRecnum()<0){return state="6";}
			else{if(sub.getKcsl()<(sub.getRecnum()-oldrecnum)){	return state="4";}
			this.equipmentDAO.saveOrUpdate(sub); 
			state="2";
			if(sub.getRecnum()!=0){
			jdbc.update("update equ_rec_sub set kcsl='"+(sub.getKcsl()+oldrecnum-sub.getRecnum())+"'where equid='"+equid+"'");
			}
			}//保存修改后的数据到设备领用从表中
		}else{                        //待领用状态修改设备数据
			if (sub.getPleRecnum()<0){return state="7";}
			if(sub.getKcsl()<(sub.getRecnum()-oldrecnum)){
				state="5";	
				return state;
			}
			sub.setRecid(Erecid);
			this.equipmentDAO.insert(sub);//新增一条数据到设备领用从表中，原待领用数据保留（仅改变库存）
			jdbc.update("update equ_rec_sub set kcsl='"+(sub.getKcsl()-sub.getRecnum())+"'where equid='"+equid+"'");
			state="3";
		}
		return state;
	}
	
	//查询设备或部件
	public List findRecEqu(String sbMc, String scCj, String jzH){
		String str1 = " and t.sb_mc like '%" + sbMc + "%'";
		String str2 = " and e.sccj like '%" + scCj + "%'";
		String str3 = " and e.jzh like '%" + jzH + "%'";
		if("".equals(sbMc)){
			str1 = "";
		}
		if("".equals(scCj)){
			str2 = "";
		}
		if("".equals(jzH)){
			str3 = "";
		}
		String sql = "select b.sb_id, t.sb_mc, t.ggxh, t.dw, t.zs, b.opensl dhsl, t.sx wztype, t.sccj, e.jzh "
					+"from equ_list t, equ_sbdh_arr e ,Equ_Open_Box_Sub b "
					+"where b.sb_id = t.sb_id(+) and t.parentid = e.sb_id" + str1 + str2 + str3;
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List list = jdbc.queryForList(sql);
		return list;
	}
	
	public String checkDelete(String[] recids){
		String state = "";
		for (int i = 0; i < recids.length; i++) {
			List list = this.equipmentDAO.findByProperty(recSubBean, "recid", recids[i]);
			if (!list.isEmpty()) {
				state = "该领用表下有设备信息！不允许进行删除";
				return state;
			}
		}
		return state;
	}
	
	public void deleteEquRec(String type, String[] recids){
		if (recids.length ==0) return;
		for (int i = 0; i < recids.length; i++) {
			EquRec er = (EquRec)this.equipmentDAO.findById(recBean, recids[i]);
			if (!"".equals(type)){
				List list = this.equipmentDAO.findByProperty(recSubBean, "recid", recids[i]);
				if (list.isEmpty()) continue;
				this.equipmentDAO.deleteAll(list);
			}
			this.equipmentDAO.delete(er);
		}
	}
	
	public String deleteRecSub(String recSubid){
		String state = "";
		EquRecSub ers = (EquRecSub)this.equipmentDAO.findById(recSubBean, recSubid);
		this.equipmentDAO.delete(ers);
		return state;
	}
	
	public void updateRecSub(EquRecSub ers){
		this.equipmentDAO.saveOrUpdate(ers);
	}
	
	/**
	 * 返回领用库存数量
	 * @param partId
	 * @return
	 */
	public int storeNum(String equId){
		return 0;
	}
	
	public int storeNum2(String equId){
		String beanRecSub = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_REC_SUB);
		List<EquRecSub> EquRecSub = this.equipmentDAO.findByWhere2(beanRecSub,  "equid='"+equId+"'and recid is null");
		if(EquRecSub.size()>0){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql="select sum(t.ple_recnum) from equ_rec_sub t where t.equid ='"+equId+"' and t.recid is not null";
		Long zAppRecnum=(Long)jdbc.queryForObject(sql, Long.class);
		return zAppRecnum.intValue();
	                  }
		return 0;
	}
    public int storeNum3(String equId){
    	String beanRecSub = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_REC_SUB);
		List<EquRecSub> EquRecSub = this.equipmentDAO.findByWhere2(beanRecSub,  "equid='"+equId+"'and recid is null");
		if(EquRecSub.size()>0){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql="select sum(t.recnum) from equ_rec_sub t where t.equid ='"+equId+"' and t.recid is not null";
		Long zRecnum=(Long)jdbc.queryForObject(sql, Long.class);
		return zRecnum.intValue();
	         }
		return 0;
        }
    }

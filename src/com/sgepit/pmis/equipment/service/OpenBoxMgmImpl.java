package com.sgepit.pmis.equipment.service;

import java.util.Iterator;
import java.util.List;

import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.equipment.dao.EquipmentDAO;
import com.sgepit.pmis.equipment.hbm.EquGetGoodsArr;
import com.sgepit.pmis.equipment.hbm.EquList;
import com.sgepit.pmis.equipment.hbm.EquOpenBox;
import com.sgepit.pmis.equipment.hbm.EquOpenBoxSub;
import com.sgepit.pmis.equipment.hbm.EquRecSub;
import com.sgepit.pmis.equipment.hbm.EquSbdhArr;


/**
 * 设备开箱的业务操作
 * @createDate May 4, 2011
 * 
 */
public class OpenBoxMgmImpl extends BaseMgmImpl implements OpenBoxMgmFacade{
	
	private EquipmentDAO equipmentDAO;

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static OpenBoxMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (OpenBoxMgmImpl) ctx.getBean("openBoxMgm");
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

	public int delOpenBox(String uuid){
		EquOpenBox eb = (EquOpenBox)this.equipmentDAO.findById(BusinessConstants.EQU_PACKAGE + BusinessConstants.EQU_OPEN_BOX, uuid);
		List list = this.equipmentDAO.findByProperty(BusinessConstants.EQU_PACKAGE
				.concat(BusinessConstants.EQU_OPEN_BOX_SUB), "openId", uuid);
		this.equipmentDAO.deleteAll(list);		
		this.equipmentDAO.delete(eb);
		return 0;
	}
	
	public void saveOrUpdate(EquOpenBox eb){
		this.equipmentDAO.saveOrUpdate(eb);
		
	}
	
	public String insertEquOpenBox(EquOpenBox eb, String uuids){
		if(eb.getOpendate().toString().equals("Thu Jan 01 08:00:00 CST 1970"))eb.setOpendate(null);
		
		this.equipmentDAO.insert(eb);
		
		String dhid = eb.getGgId();
		List sbdh = this.equipmentDAO.findByProperty(
						    BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_DH_ARR),
			                "dhId", dhid);
		for(int i=0;i<sbdh.size();i++){
			EquOpenBoxSub subbox = new EquOpenBoxSub();
			EquSbdhArr sbArr = (EquSbdhArr)sbdh.get(i);
			
			String sql = "select sum(opensl)opensl from equ_open_box_sub where sbbm='"+sbArr.getSbbm()+"' and open_id in(select uuid from equ_open_box where kxzt='2')";
			List ysslList = this.equipmentDAO.getDataAutoCloseSes(sql);
			Double d = new Double(0);
			if(ysslList.get(0)!=null){
				d = Double.parseDouble(ysslList.get(0)+"");
			}
			
			subbox.setYssl(d);
			subbox.setOpenId(eb.getUuid());
			subbox.setSbId(sbArr.getSbId());
			subbox.setOpensl(sbArr.getDhsl());
			subbox.setDz(Double.parseDouble(sbArr.getDz()==null?"0":sbArr.getDz()));
			subbox.setZz(Double.parseDouble(sbArr.getZz()==null?"0":sbArr.getZz()));
			subbox.setDhtj(sbArr.getDhtj());
			subbox.setZcd(sbArr.getZcd());
			subbox.setCzcdj(sbArr.getCzcdj());
			subbox.setPid(sbArr.getPid());
			subbox.setConid(eb.getConid());
			this.equipmentDAO.saveOrUpdate(subbox);
		}
		return eb.getUuid();
		
	}
	
	//在从表中新增数据时，列出待选设备或部件的字段
	public List equGoodsSub(String conId){
		String sql = "select e.sb_id, t.sb_mc, e.ggxh, e.dw, e.zs, e.dhsl, e.wztype,"
					+"e.sccj, e.jzh from equ_list t, equ_sbdh_arr e "
					+"where t.sb_id = e.sb_id and e.conid = '" + conId + "'";
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List list = jdbc.queryForList(sql);
		return list;
	}	
	
	public void saveall(String boxno){
		JdbcTemplate jdbc =  JdbcUtil.getJdbcTemplate();
		List list = this.equipmentDAO.findByWhere2(BusinessConstants.EQU_PACKAGE + BusinessConstants.EQU_OPEN_BOX, "boxno = '"+ boxno +"'");
		Iterator<EquOpenBox> itr=list.iterator();
		EquOpenBoxSub openboxsub=new EquOpenBoxSub();
		Double d = new Double(0);
		Double DHSL=new Double(0);
		Double ZS=new Double(0);
		Double DZ=new Double(0);
		Double ZZ=new Double(0);
		String DW=null,SBBM=null;
		while (itr.hasNext()){
			EquOpenBox open=(EquOpenBox)itr.next();
			if(open.getSbmc().indexOf("箱")==-1){
			List list2 = this.equipmentDAO.findByWhere2(BusinessConstants.EQU_PACKAGE + BusinessConstants.EQU_OPEN_BOX_SUB, "openId = '"+ open.getUuid() +"'");
			if(list2.isEmpty()){
			   List EquSbdhArrlist = this.equipmentDAO.findByWhere2(BusinessConstants.EQU_PACKAGE + BusinessConstants.EQU_DH_ARR, "DH_ID = '"+ open.getGgId() +"'and SB_ID='"+open.getSbid()+"'");
			   Iterator<EquSbdhArr> sbdhit=EquSbdhArrlist.iterator();
			   while(sbdhit.hasNext()){
				   EquSbdhArr sbdh=(EquSbdhArr)sbdhit.next();
				   DHSL=sbdh.getDhsl();
				   DZ=Double.parseDouble(sbdh.getDz());
				   ZZ=Double.parseDouble(sbdh.getZz());
				   ZS=sbdh.getZs();
				   DW=sbdh.getDw();
				   SBBM=sbdh.getSbbm();
			   }
				openboxsub.setOpenId(open.getUuid());
			    openboxsub.setSbId(open.getSbid());			
			    openboxsub.setSl(ZS);
			    openboxsub.setOpensl(DHSL);
			    openboxsub.setOpensl(DZ);
			    openboxsub.setOpensl(ZZ);
			    this.equipmentDAO.insert(openboxsub);
			    
			    
				//加载数据到设备领用的"待领用中"
				List<EquRecSub> EquRecSub = this.equipmentDAO.findByWhere2(BusinessConstants.EQU_PACKAGE + BusinessConstants.EQU_REC_SUB,"equid='"+open.getSbid()+"'");
				EquRecSub rqurecsub=new EquRecSub();
				if(EquRecSub.isEmpty()){
				rqurecsub.setEquid(open.getSbid());
				rqurecsub.setConid(open.getConid());
			    rqurecsub.setWztype(open.getWztype());
			    rqurecsub.setSbmc(open.getSbmc());
			    rqurecsub.setGgxh(open.getGgxh());
			    rqurecsub.setDw(DW);
			    rqurecsub.setSccj(open.getBuildPart());
				rqurecsub.setPleRecnum(Double.parseDouble("0"));           //请领数量一开始设为0
				rqurecsub.setRecnum(Double.parseDouble("0"));              // 领用数量一开始设为0
				rqurecsub.setMachineNo(open.getJzh());
				rqurecsub.setBox_no(open.getBox_no());
				rqurecsub.setPart_no(open.getPartno());
				rqurecsub.setKcsl(DHSL);
				this.equipmentDAO.insert(rqurecsub);
				}else{
					Long OldDhsl=(Long)jdbc.queryForObject("select  kcsl from EQU_REC_SUB where equid='"+open.getSbid()+"' and recid is null", Long.class);
					jdbc.update("update equ_rec_sub set kcsl='"+(OldDhsl+DHSL)+"' where equid='"+open.getSbid()+"'");
				}
				jdbc.update("update equ_sbdh_arr set dhzt=2 where dh_id='"+open.getGgId()+"' and sb_id='"+open.getSbid()+"'");
		}}}		
	}
	public void insertSelectEqu(String conid,String[] ids,String partb){
		String equBean = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_DH_ARR);
		for(int i=0;i<ids.length;i++){
			List list = this.equipmentDAO.findByWhere2(equBean, "sb_id = '"+ ids[i] +"'");
			if(list.size() > 0){
				EquSbdhArr arr = (EquSbdhArr) list.get(0);
				EquOpenBox open = new EquOpenBox();
				open.setConid(conid);
				open.setSbid(arr.getSbId());
				open.setSbmc(arr.getSbmc());
				open.setJzh(arr.getJzh());
				open.setBuildPart(partb);
				open.setPid(arr.getPid());
				open.setPartno(arr.getPartno());
				EquGetGoodsArr main = (EquGetGoodsArr) this.equipmentDAO.findById(BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_GET_GOODS_ARR), arr.getDhId());
				open.setCheckdate(main.getGgDate());
				this.equipmentDAO.saveOrUpdate(open);
				arr.setKxdh(open.getUuid());
				arr.setIskx(new Long(1));
				this.equipmentDAO.saveOrUpdate(arr);
			}
		}
	}
	
	//保存设备开箱从表信息
	public String  saveOpenBoxSub(EquOpenBoxSub sub){
		String state="";
		if(sub.getOpensl()==null){sub.setOpensl(new Double(0));}
		else if(sub.getSl()==null){sub.setSl(new Double(0));}
		else if(sub.getOpensl()<0||sub.getSl()<0){
			state="到货数量输入错误";
			return state;
		}
		if(sub.getDz()==null){sub.setDz(new Double(0));}
		else if(sub.getZz()<0||sub.getDz()<0){
			state="单重输入错误";
			return state;
		}
		String sbid = sub.getSbId();
		String equlistBean = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_LIST);
		EquList equlist = (EquList) this.equipmentDAO.findById(equlistBean, sbid);
		equlist.setZs(sub.getSl().doubleValue());
		this.equipmentDAO.saveOrUpdate(sub);//保存修改后的数据到设备开箱从表中
		this.equipmentDAO.saveOrUpdate(equlist);//更新设备清单中的总数量		
		
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = "update equ_open_box_sub set sl = '"+ sub.getSl() +"' where sb_id = '"+ sbid +"'";
		String sql2 = "update equ_sbdh_arr set zs = '"+ sub.getSl() +"' where sb_id = '"+ sbid +"'";
		String openGgid=(String)jdbc.queryForObject("select gg_id from equ_open_box where uuid='"+sub.getOpenId()+"'",String.class);
		String sql3 = "update equ_sbdh_arr set dhsl = '"+ sub.getOpensl() +"' where sb_id = '"+ sbid +"' and dh_id='"+openGgid+"'";
		String sql5 = "update equ_sbdh_arr set dz = '"+ sub.getDz() +"' where sb_id = '"+ sbid +"' and dh_id='"+openGgid+"'";
		String sql6 = "update equ_sbdh_arr set zz = '"+ sub.getZz() +"' where sb_id = '"+ sbid +"' and dh_id='"+openGgid+"'";
		jdbc.update(sql);//更新设备开箱从表中的所有相同编号设备的总数量
		Long allDhsl=(Long)jdbc.queryForObject("select sum(opensl) from EQU_OPEN_BOX_SUB where sb_id='"+sbid+"'", Long.class);
		String sql4="update equ_rec_sub  set kcsl='"+allDhsl+"' where equid='"+sbid+"'";
		jdbc.update(sql4);//更新领用从表中的裸件的库存数量
		return state;
	}
	
	public String checkDelete(String openid){
		String openSubBean = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_OPEN_BOX_SUB);
		String state = "";
		List list = this.equipmentDAO.findByProperty(openSubBean, "openId", openid);
		Iterator<EquOpenBoxSub> itr = list.iterator();
		if (!list.isEmpty()){
			while(itr.hasNext()){
				EquOpenBoxSub arr = itr.next();
				List list1 = this.equipmentDAO.findByProperty(BusinessConstants.EQU_PACKAGE.
						concat(BusinessConstants.EQU_REC_SUB), "equid", arr.getSbId());
				if(list1.size()>0)return "不能删除";
			}
			state = "该开箱下有部件信息！是否删除！";
		} 
		return state;
	}	
	public void deleteBoxno(String uuid){
		JdbcTemplate j = JdbcUtil.getJdbcTemplate();
		j.update("update equ_open_box set boxno='',opendate='' where uuid='"+uuid+"'");	
	}
	
	public String checkDeleteOpenSub(String[] ids){
		String result = "";
		for(String id:ids){
			List list = this.equipmentDAO.findByProperty(BusinessConstants.EQU_PACKAGE.
					concat(BusinessConstants.EQU_REC_SUB), "equid", id);
			if(list.size()>0)return "不能删除";
		}
		return result;
	}
	
	
	public void changedhzt(String ggId,String sbid,String opendate){
		JdbcTemplate j = JdbcUtil.getJdbcTemplate();
		if(!opendate.equals("")){
			j.update("update equ_sbdh_arr set dhzt=1 where dh_id='"+ggId+"' and sb_id='"+sbid+"'");
		}else {
			j.update("update equ_sbdh_arr set dhzt='' where dh_id='"+ggId+"' and sb_id='"+sbid+"'");
			j.update("update equ_open_box set billstate='' where gg_id='"+ggId+"' and sbid='"+sbid+"'");
		}
	}
	
	
	
	
	
	
}



















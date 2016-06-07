package com.sgepit.pmis.equipment.service;

import java.text.NumberFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.equipment.dao.EquipmentDAO;
import com.sgepit.pmis.equipment.hbm.EquGetGoods;
import com.sgepit.pmis.equipment.hbm.EquHouseout;
import com.sgepit.pmis.equipment.hbm.EquHouseoutSub;
import com.sgepit.pmis.equipment.hbm.EquList;
import com.sgepit.pmis.equipment.hbm.EquOpenBox;
import com.sgepit.pmis.equipment.hbm.EquOpenBoxSub;
import com.sgepit.pmis.equipment.hbm.EquSbaz;
import com.sgepit.pmis.equipment.hbm.EquSbdh;

public class EqugetgoodsMgmImpl extends BaseMgmImpl implements EqugetgoodsMgmFacade{
	
	private EquipmentDAO equipmentDAO;

	
	private String beanName = BusinessConstants.EQU_PACKAGE + BusinessConstants.EQU_GET_GOODS;
	private String goodsSubBean = BusinessConstants.EQU_PACKAGE + BusinessConstants.EQU_DH;
	
	private String houseOutBean = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_HOUSEOUT);
	private String houseOutSubBean = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_HOUSEOUT_SUB);
	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static EqugetgoodsMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (EqugetgoodsMgmImpl) ctx.getBean("equGetGoodsMgm");
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
	public void insertGetGoods(EquGetGoods equGetGoods){
		this.equipmentDAO.insert(equGetGoods);
	}
	
	public void updateGetGoods(EquGetGoods equGetGoods){
		this.equipmentDAO.saveOrUpdate(equGetGoods);
	}
	public void inserthousOutGoods(EquHouseout equhouseout){
		this.equipmentDAO.insert(equhouseout);
	}
	
	public void updateGetOuseoutGoods(EquHouseout equhouseout){
		this.equipmentDAO.saveOrUpdate(equhouseout);
	}
	
	/**
	 * 删除到货记录时,判断下面是否有到货设备和到货部件
	 * @param ggid
	 * @return
	 */
	public String checkDelete(String ggid){
		String state = "";
		List list = this.equipmentDAO.findByProperty(goodsSubBean, "dhId", ggid);
		if (!list.isEmpty()) state = "该设备入库单下有[入库设备]信息！是否删除！";
		return state;
	}
	
	/**
	 * 删除到货记录
	 * @param ggid
	 * @param type
	 */
	public void deleteGetGoods(String ggid, String type){
		if (!"".equals(type)){
			List list = this.equipmentDAO.findByProperty(goodsSubBean, "dhId", ggid);
			this.equipmentDAO.deleteAll(list);
		}
		EquGetGoods equGetGoods = (EquGetGoods)this.equipmentDAO.findById(beanName, ggid);
		this.equipmentDAO.delete(equGetGoods);
	}
	/**
	 * 删除出库单信息
	 * @param ckdId
	 * @return
	 */
	public boolean deleteCkd(String ckdId){
		
		try{
			List list = this.equipmentDAO.findByProperty(houseOutSubBean, "outid", ckdId);
			this.equipmentDAO.deleteAll(list);
			EquHouseout hbm = (EquHouseout) this.equipmentDAO.findById(houseOutBean, ckdId);
			this.equipmentDAO.delete(hbm);	
			return true;
		}catch(Exception ex){
			return false;
		}
	}
	
	
	public List getGoodsSub(String ggid){
		String sql = "select gs.*, i.equ_name, p.part_name, p.part_num "
					+"from equ_get_goods_sub gs, equ_info i, equ_info_part p "
					+"where gs.equid = i.equid and gs.partid = p.partid and gs.ggid = '"+ggid+"'";
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List list = jdbc.queryForList(sql);
		return list;
	}
	
	public String initGetGoodsBh(String initBh){
		Date date = new Date();
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = "select nvl(max(substr(gg_no,-3)),0)+1 from equ_get_goods where gg_no like '"+ initBh +"%'";
		String bhGet = (String) jdbc.queryForObject(sql, String.class);
		NumberFormat format = NumberFormat.getNumberInstance(Locale.getDefault());
		format.setMinimumIntegerDigits(3);
		return initBh.concat(format.format(Integer.valueOf(bhGet)));
	}
	public String initHouseOutBh(String initBh){
		Date date = new Date();
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = "select nvl(max(substr(outno,-3)),0)+1 from equ_houseout where outno like '"+ initBh +"%'";
		String bhGet = (String) jdbc.queryForObject(sql, String.class);
		NumberFormat format = NumberFormat.getNumberInstance(Locale.getDefault());
		format.setMinimumIntegerDigits(3);
		return initBh.concat(format.format(Integer.valueOf(bhGet)));
	}
	
	/*
	 * 检查出库或者入库单号是否存在
	 * @param bh 自动生成的编号
	 * @param type (in或者out)判断是出库还是入库
	 */
	public boolean checkBhExist(String bh,String type){			
		String sql = "select * from equ_get_goods where gg_no = '"+ bh +"'";
		if(type.equals("out")){
			sql = "select * from equ_houseout where outno = '"+bh+"'";
		}
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List list = jdbc.queryForList(sql);
		if(list.size()==0)return true;
		return false;
	}
	/**
	 * 设备入库时允许多选 2010年10月27日 hanhl
	 * 2010-12-21 入库修改为从设备清单中选择验收数量大于0的设备进行入库，如开箱无关
	 * @param sbdhid 设备到货ID
	 * @param sbids 到货清单中选择的设备的主键，多个用,分隔
	 * @return
	 */
	public boolean insertEquSbrk(String sbrkId,String sbkxId,String sbids){
		EquOpenBox equOpenBox = (EquOpenBox) this.equipmentDAO.findById("com.sgepit.pmis.equipment.hbm.EquOpenBox", sbkxId);
		List<EquOpenBoxSub> dhList = this.equipmentDAO.findByWhere("com.sgepit.pmis.equipment.hbm.EquOpenBoxSub",
				"open_id = '"+equOpenBox.getUuid()+"' and sb_id in ("+StringUtil.transStrToIn(sbids,",")+")");
		//List<EquSbdh> rkList = new ArrayList<EquSbdh>();
		if(dhList.size()>0){
			try{
				for(int i=0;i<dhList.size();i++){
					EquOpenBoxSub sbkx = dhList.get(i);
					EquSbdh equsbdh = new EquSbdh();
					equsbdh.setDhId(sbrkId.replaceAll("'", ""));
					//2010-12-19 设备入库是保存入库设备所属的合同号，出库时需根据合同选择出库设备
					equsbdh.setConid(equOpenBox.getConid());
					equsbdh.setSbId(sbkx.getSbId());
					equsbdh.setSbno(sbkx.getSbbm());
					equsbdh.setPid(equOpenBox.getPid());
					this.equipmentDAO.insert(equsbdh);
				}				
				return true;
			}catch(Exception ex){
				return false;
			}
		}
		return false;
	}
	
	/**
	 * 2010-12-21 入库修改为从设备清单中选择验收数量大于0的设备进行入库，如开箱无关
	 * @param conid 合同号
	 * @param sbids	设备编号集合
	 * @return
	 */
	public boolean insertEquSbrkFromEquList(String rkid,String conid,String sbids){
		List<EquList> equList = this.equipmentDAO.findByWhere("com.sgepit.pmis.equipment.hbm.EquList",
				"conid = '"+conid+"' and sb_id in ("+StringUtil.transStrToIn(sbids,",")+")"); 
		if(equList.size()>0){
			try {
				for (int i = 0; i < equList.size(); i++) {
					EquList list = equList.get(i);
					EquSbdh equsbdh = new EquSbdh();
					
					equsbdh.setDhId(rkid);
					equsbdh.setConid(conid);
					equsbdh.setSbId(list.getSbId());
					equsbdh.setSbno(list.getSbBm());
					equsbdh.setSbmc(list.getSbMc());
					equsbdh.setGgxh(list.getGgxh());
					equsbdh.setPid(list.getPid());
					this.equipmentDAO.insert(equsbdh);
				}
				return true;
			} catch (Exception e) {
				return false;
			}		
		}
		return false;
	}
	
	public boolean insertEqusbdh(String dhid,String sbid,String sbbm,String sbmc,String ggxh,String dw,String opensl,String haveFlag){
		try{
			if("1".equals(haveFlag)){
				if(this.deleteSbdh(dhid.replaceAll("'", ""))){
					EquSbdh equsbdh = new EquSbdh();
					equsbdh.setDhId(dhid.replaceAll("'", ""));
					equsbdh.setSbId(sbid==null?"":sbid);
					equsbdh.setSbno(sbbm==null?"":sbbm);
					equsbdh.setRksl(Long.parseLong(opensl==null?"0":opensl));
					this.equipmentDAO.insert(equsbdh);
				}
			}else{
				EquSbdh equsbdh = new EquSbdh();
				equsbdh.setDhId(dhid.replaceAll("'", ""));
				equsbdh.setSbId(sbid==null?"":sbid);
				equsbdh.setSbno(sbbm==null?"":sbbm);
				equsbdh.setRksl(Long.parseLong(opensl==null?"0":opensl));
				this.equipmentDAO.insert(equsbdh);
			}
			
		}catch(Exception e){
			return false;
		}
		return true;
	}
	
	public boolean deleteSbdh(String dhid){
		List list = this.equipmentDAO.findByProperty("com.sgepit.pmis.equipment.hbm.EquSbdh", "dhId",dhid);
		this.equipmentDAO.deleteAll(list);
		return true;
	}
	
	
	
	/*
	 * 2010-12-27 保存设备出库子表信息，并同时更新设备清单中出库总数量和库存总数量
	 */
	public void saveHoustOutSub(String uuid,String conid ){
		String equid = new String();
		//for (int i = 0; i < subs.length; i++) {
			EquHouseoutSub equHouseoutSub = (EquHouseoutSub) this.equipmentDAO.findById("com.sgepit.pmis.equipment.hbm.EquHouseoutSub", uuid);
			//保存出库子表
			this.equipmentDAO.saveOrUpdate(equHouseoutSub);
			//更新清单中出库总数量
			equid = equHouseoutSub.getSbno();
	   		String sumSql = "select sum(cksl) from equ_houseout_sub where equid='"+equid+"' and outid in (select outid from equ_houseout t where conid='"+conid+"')";
	   		String sql = "update equ_list set ckzsl=("+sumSql+") where conid='"+conid+"' and sb_id='"+equid+"'";
	   		this.equipmentDAO.updateBySQL(sql);	
	   		//更新库存总数量
			String kcsql = "update equ_list set kczsl=rkzsl-ckzsl where conid='"+conid+"' and sb_id='"+equid+"'";
			this.equipmentDAO.updateBySQL(kcsql);
		//}
	}
	

	/**
	 * 删除入库从表设备，同时更新设备总入库数量和库存数量。
	 * @param uuids 入库设备从表主键
	 * @return	删除成功，返回true
	 * @author zhangh
	 * @since 2011-03-10
	 */
	public boolean deleteGetGoodInputSub(String[] uuids){
		boolean flag = true;
		String goodInputSubBean = "com.sgepit.pmis.equipment.hbm.EquSbdh";
		try {
			for (int i = 0; i < uuids.length; i++) {
				EquSbdh equSbdh = (EquSbdh) this.equipmentDAO.findById(goodInputSubBean, uuids[i]);
				//由于设置了主从表的主外键关系和级联删除，此处由触发器执行更新。
				//删除设备时，清单中的总入库数量-本次设备入库数量
				//String sqlrk="update equ_list set rkzsl=rkzsl-nvl("+equSbdh.getRksl()+",0) where conid='"+equSbdh.getConid()+"' and sb_id='"+equSbdh.getSbId()+"'";
				//this.equipmentDAO.updateBySQL(sqlrk);
				//同时更新总库存数量
				//String sqlkc="update equ_list set kczsl=kczsl-nvl("+equSbdh.getRksl()+",0) where conid='"+equSbdh.getConid()+"' and sb_id='"+equSbdh.getSbId()+"'";
				//this.equipmentDAO.updateBySQL(sqlkc);
				//删除设备
				this.equipmentDAO.delete(equSbdh);
			}
		} catch (Exception e) {
			e.printStackTrace();
			flag = false;
		}
		return flag;
	}
	
	/**
	 * 删除入库主表数据，同时调用deleteGetGoodInputSub更新入库数，并删除从表数据
	 * @param ggid 入库单主键
	 * @return
	 */
	public boolean deleteGetGoodInput(String ggid){
		//查询出对应从表List
		List list = this.equipmentDAO.findByProperty(goodsSubBean, "dhId", ggid);
		String[] uuids=new String[list.size()];
		for (int i = 0; i < list.size(); i++) {
			EquSbdh equSbdh = (EquSbdh) list.get(i);
			uuids[i] = equSbdh.getUuid();
		}
		//更具所有从表uuid更新入库数，并执行删除
		this.deleteGetGoodInputSub(uuids);
		
		EquGetGoods equGetGoods = (EquGetGoods)this.equipmentDAO.findById(beanName, ggid);
		this.equipmentDAO.delete(equGetGoods);
		return true;
	}
	
	
	
	/**
	 * 删除出库从表设备，同时更新设备总出库数量和库存数量。
	 * @param uuids 出库设备从表主键
	 * @return	删除成功，返回true
	 * @author zhangh
	 * @since 2011-03-10
	 */
	public int deleteHouseOutSub(String[] uuids){
		int n = 1;
		try {		
			for (int i = 0; i < uuids.length; i++) {
				EquHouseoutSub outSub = (EquHouseoutSub) this.equipmentDAO.findById(houseOutSubBean, uuids[i]);
				//删除前判断设备是否已经安装，已经安装的设备不能删除
				String where = "ckdId='"+outSub.getOutid()+"' and sbId='"+outSub.getSbno()+"'";
				List<EquSbaz> list = this.equipmentDAO.findByWhere("com.sgepit.pmis.equipment.hbm.EquSbaz", where);
				if(list.size()>0){
					n=2;
					break;
				}
			}
			
			//由于设置了主从表的主外键关系和级联删除，此处更新equ_list由触发器执行更新。
			if(n==1){
				for (int i = 0; i < uuids.length; i++) {
					EquHouseoutSub outSub = (EquHouseoutSub) this.equipmentDAO.findById(houseOutSubBean, uuids[i]);
					//删除设备时，更新出库数量
					//String sqlck="update equ_list set ckzsl=ckzsl-nvl("+outSub.getCksl()+",0) where sb_id='"+outSub.getEquid()+"'";
					//this.equipmentDAO.updateBySQL(sqlck);
					//同时更新总库存数量
					//String sqlkc="update equ_list set kczsl=kczsl+nvl("+outSub.getCksl()+",0) where sb_id='"+outSub.getEquid()+"'";
					//this.equipmentDAO.updateBySQL(sqlkc);
					//删除设备
					this.equipmentDAO.delete(outSub);
				}
			}
			return n;
		} catch (Exception e) {
			e.printStackTrace();
			return 0;
		}
	}
	
	
	/**
	 * 删除出库主表数据，同时调用deleteHouseOutSub更新出库数，并删除从表数据
	 * @param outid 出库单主键
	 * @return
	 */
	public int deleteHouseOut(String outid){
		int m = 1;
		try {
			//查询出对应从表List
			List list = this.equipmentDAO.findByProperty(houseOutSubBean, "outid", outid);
			String[] uuids=new String[list.size()];
			for (int i = 0; i < list.size(); i++) {
				EquHouseoutSub outSub = (EquHouseoutSub) list.get(i);
				uuids[i] = outSub.getUuid();
			}
			//根据所有从表uuid更新入库数，并执行删除
			int n = this.deleteHouseOutSub(uuids);
			if(n==1){
				EquHouseout out = (EquHouseout)this.equipmentDAO.findById(houseOutBean, outid);
				this.equipmentDAO.delete(out);			
			}else{
				m=n;
			}
			return m;
		} catch (Exception e) {
			e.printStackTrace();
			return 0;
		}
	}
	
	
	
}

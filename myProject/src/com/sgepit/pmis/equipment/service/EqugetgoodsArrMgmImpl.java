package com.sgepit.pmis.equipment.service;

import java.text.NumberFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;

import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.frame.flow.hbm.ZlInfo;
import com.sgepit.pmis.equipment.dao.EquipmentDAO;
import com.sgepit.pmis.equipment.hbm.EquGetGoodsArr;
import com.sgepit.pmis.equipment.hbm.EquList;
import com.sgepit.pmis.equipment.hbm.EquOpenBox;
import com.sgepit.pmis.equipment.hbm.EquSbdhArr;
import com.sgepit.pmis.equipment.hbm.EquSbdhZl;


public class EqugetgoodsArrMgmImpl extends BaseMgmImpl implements
		EqugetgoodsArrMgmFacade {
	private EquipmentDAO equipmentDAO;

	private String beanName = BusinessConstants.EQU_PACKAGE + BusinessConstants.EQU_GET_GOODS_ARR;
	private String goodsSubBean = BusinessConstants.EQU_PACKAGE + BusinessConstants.EQU_DH_ARR;
	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static EqugetgoodsMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (EqugetgoodsMgmImpl) ctx.getBean("equGetGoodsArrMgm");
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
	public void insertGetGoods(EquGetGoodsArr equGetGoodsArr){
		if ("Thu Jan 01 08:00:00 CST 1970".equals(equGetGoodsArr.getConjh_date()==null?"":equGetGoodsArr.getConjh_date().toString())){
			equGetGoodsArr.setConjh_date(null);
		}
		if ("Thu Jan 01 08:00:00 CST 1970".equals(equGetGoodsArr.getSjfhrq()==null?"":equGetGoodsArr.getSjfhrq().toString())){
			equGetGoodsArr.setSjfhrq(null);
		}
		if ("Thu Jan 01 08:00:00 CST 1970".equals(equGetGoodsArr.getConsj_date()==null?"":equGetGoodsArr.getConsj_date().toString())){
			equGetGoodsArr.setConsj_date(null);
		}
		if ("Thu Jan 01 08:00:00 CST 1970".equals(equGetGoodsArr.getGgDate()==null?"":equGetGoodsArr.getGgDate().toString())){
			equGetGoodsArr.setGgDate(null);
		}
		if ("Thu Jan 01 08:00:00 CST 1970".equals(equGetGoodsArr.getSgDate()==null?"":equGetGoodsArr.getSgDate().toString())){
			equGetGoodsArr.setSgDate(null);
		}
		if ("Thu Jan 01 08:00:00 CST 1970".equals(equGetGoodsArr.getYjdhrq()==null?"":equGetGoodsArr.getYjdhrq().toString())){
			equGetGoodsArr.setYjdhrq(null);
		}
		if ("Thu Jan 01 08:00:00 CST 1970".equals(equGetGoodsArr.getYjfhrq()==null?"":equGetGoodsArr.getYjfhrq().toString())){
			equGetGoodsArr.setYjfhrq(null);
		}
		
		this.equipmentDAO.insert(equGetGoodsArr);
	}
	
	public void updateGetGoods(EquGetGoodsArr equGetGoodsArr){
		if ("Thu Jan 01 08:00:00 CST 1970".equals(equGetGoodsArr.getConjh_date()==null?"":equGetGoodsArr.getConjh_date().toString())){
			equGetGoodsArr.setConjh_date(null);
		}
		if ("Thu Jan 01 08:00:00 CST 1970".equals(equGetGoodsArr.getSjfhrq()==null?"":equGetGoodsArr.getSjfhrq().toString())){
			equGetGoodsArr.setSjfhrq(null);
		}
		if ("Thu Jan 01 08:00:00 CST 1970".equals(equGetGoodsArr.getConsj_date()==null?"":equGetGoodsArr.getConsj_date().toString())){
			equGetGoodsArr.setConsj_date(null);
		}
		if ("Thu Jan 01 08:00:00 CST 1970".equals(equGetGoodsArr.getGgDate()==null?"":equGetGoodsArr.getGgDate().toString())){
			equGetGoodsArr.setGgDate(null);
		}
		if ("Thu Jan 01 08:00:00 CST 1970".equals(equGetGoodsArr.getSgDate()==null?"":equGetGoodsArr.getSgDate().toString())){
			equGetGoodsArr.setSgDate(null);
		}
		if ("Thu Jan 01 08:00:00 CST 1970".equals(equGetGoodsArr.getYjdhrq()==null?"":equGetGoodsArr.getYjdhrq().toString())){
			equGetGoodsArr.setYjdhrq(null);
		}
		if ("Thu Jan 01 08:00:00 CST 1970".equals(equGetGoodsArr.getYjfhrq()==null?"":equGetGoodsArr.getYjfhrq().toString())){
			equGetGoodsArr.setYjfhrq(null);
		}
		this.equipmentDAO.saveOrUpdate(equGetGoodsArr);
	}
	
	
	/**
	 * 删除到货记录时,判断下面是否有到货设备和到货部件
	 * @param ggid
	 * @return
	 */
	public String checkDelete(String ggid){
		String state = "";
		List list = this.equipmentDAO.findByProperty(goodsSubBean, "dhId", ggid);
		Iterator<EquSbdhArr> itr = list.iterator();
		if (!list.isEmpty()){
			while(itr.hasNext()){
				EquSbdhArr arr = itr.next();
				List list1 = this.equipmentDAO.findByProperty(BusinessConstants.EQU_PACKAGE.
						concat(BusinessConstants.EQU_OPEN_BOX), "sbid", arr.getSbId());
				if(list1.size()>0)return "不能删除";
			}
			state = "该设备到货下有[到货部件]信息！是否删除！";
		} 
		return state;
	}
	
	public String initGetGoodsBh(String initBh){
		Date date = new Date();
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = "select nvl(max(substr(gg_no,-3)),0)+1 from equ_get_goods_arr where gg_no like '"+ initBh +"%'";
		String bhGet = (String) jdbc.queryForObject(sql, String.class);
		NumberFormat format = NumberFormat.getNumberInstance(Locale.getDefault());
		format.setMinimumIntegerDigits(3);
		return initBh.concat(format.format(Integer.valueOf(bhGet)));
	}
	
	public boolean checkBhExist(String bh){
		String sql = "select * from equ_get_goods_arr where gg_no = '"+ bh +"'";
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List list = jdbc.queryForList(sql);
		if(list.size()==0)return true;
		return false;
	}
	//保存设备到货从表信息
	public String saveEquSbdh(EquSbdhArr equ){
		String state="";
		if(equ.getZs()<0||equ.getDhsl()<0){
			state="到货数量输入错误";
			return state;
		}
		String sbid = equ.getSbId();
		String equlistBean = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_LIST);
		EquList equlist = (EquList) this.equipmentDAO.findById(equlistBean, sbid);
		equlist.setZs(equ.getZs());
		this.equipmentDAO.saveOrUpdate(equ);//保存修改后的数据到设备到货从表中
		this.equipmentDAO.saveOrUpdate(equlist);//更新设备清单中的总数量
		
		    JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			String sql ="update equ_sbdh_arr set zs = '"+ equ.getZs() +"' where sb_id = '"+ sbid +"'";
			String sql2="update equ_open_box set box_no='"+equ.getBoxno()+"',paryno ='"+equ.getPartno()+"',jzh='"+equ.getJzh()+"' where gg_id='"+equ.getDhId()+"'and sbid = '"+ equ.getSbId() +"'";
			String sql3="update equ_open_box_sub  set sl='"+equ.getZs()+"' where sb_id='"+sbid+"'";
//			String openUuid=(String)jdbc.queryForObject("select uuid from equ_open_box where gg_id='"+equ.getDhId()+"'and sbid = '"+ equ.getSbId() +"'",String.class);
//			String sql4="update equ_open_box_sub set opensl='"+equ.getDhsl()+"' where sb_id='"+sbid+"' and open_id='"+openUuid+"'";
			jdbc.update(sql);//更新设备到货从表中所有相同编号设备的总数量
			jdbc.update(sql2);//更新开箱主表中的箱件号、部件号
			jdbc.update(sql3);//更新开箱从表中的裸件总到货数量
//			jdbc.update(sql4);//更新开箱从表中的裸件当前到货数量
			Long allDhsl=(Long)jdbc.queryForObject("select sum(opensl) from EQU_OPEN_BOX_SUB where sb_id='"+sbid+"'", Long.class);
			String sql5="update equ_rec_sub  set kcsl='"+allDhsl+"' where equid='"+sbid+"'";
			jdbc.update(sql5);//更新领用从表中的裸件的库存数量
			return state;
	}
	
	public String checkDeleteEqu(EquSbdhArr equ){
		String result = "";
		//for(String id:ids){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List list1 = (List)this.equipmentDAO.findByWhere2(BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_OPEN_BOX), "ggId='"+equ.getDhId()+"'and sbid = '"+ equ.getSbId() +"'");
		Iterator<EquOpenBox> itr = list1.iterator();
		String openUuid=null;
		while (itr.hasNext()){
			EquOpenBox open=(EquOpenBox)itr.next();
			openUuid=open.getUuid();
		}
			List list = this.equipmentDAO.findByProperty(BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_OPEN_BOX_SUB), "openId", openUuid);
			if (!list.isEmpty()) {
				result = "该设备已被开箱验收，不能删除!";
				return result;
			}
		String sql = "update equ_list set zs = '"+(equ.getZs()-equ.getDhsl()) +"' where sb_id = '"+ equ.getSbId() +"'";
		String sql2 = "delete from equ_open_box where gg_id='"+equ.getDhId()+"' and  sbid = '"+ equ.getSbId() +"'";
		String sql3 = "update equ_sbdh_arr set zs = '"+ (equ.getZs()-equ.getDhsl()) +"' where sb_id = '"+ equ.getSbId() +"'";
		jdbc.update(sql);
		jdbc.update(sql2);
		jdbc.update(sql3);
		//String openBean=BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_OPEN_BOX);
			//List list = this.equipmentDAO.findByProperty(openBean, "sbid", id);	
			//if(list.size()>0)return "不能删除";
		//}
		return result;
	}
	
	/**
	 * 保存设备资料
	 * @param fileid
	 * @param filename
	 * @param dhbh
	 * @param pid
	 * @return
	 * @createDate: May 4, 2011
	 */
	public boolean insertSbZl(String fileid,String filename,String dhbh, String pid){
		try{
			EquSbdhZl equzl = new EquSbdhZl();
			equzl.setFileid(fileid);
			equzl.setFilename(filename);
			equzl.setUids(fileid);
			equzl.setDateup(new Date());
			equzl.setIsremove("否");
			equzl.setDhId(dhbh);
			equzl.setPid(pid);
			this.equipmentDAO.saveOrUpdate(equzl);
		}catch(Exception e){
			return false;
		}
		return true;
	}
	
	public boolean removeSbZl(ZlInfo zlinfo){
		try{
			this.equipmentDAO.insert(zlinfo);
			EquSbdhZl equzl = (EquSbdhZl)equipmentDAO.findById("com.sgepit.pmis.equipment.hbm.EquSbdhZl", zlinfo.getFilelsh());
			equzl.setIsremove("是");
			equzl.setDateremove(new Date());
			this.equipmentDAO.saveOrUpdate(equzl);
		}catch(Exception e){
			return false;
		}
		return true;
	}
	
	
	
	/**
	 * 删除到货从表设备，同时更新设备总到货数量。
	 * @param uuids 到货设备从表主键
	 * @return	删除成功，返回true
	 * @author zhangh
	 * @since 2011-03-07
	 */
	public boolean deleteGetGoodsSub(String[] uuids){
		boolean flag = true;
		try {
			for (int i = 0; i < uuids.length; i++) {
				EquSbdhArr equSbdhArr = (EquSbdhArr) this.equipmentDAO.findById(goodsSubBean, uuids[i]);
				//由于设置了主从表的主外键关系和级联删除，此处由触发器执行更新。
				//删除设备时更新该设备在清单中的总到货数量
				//String sql="update equ_list set dhzsl=dhzsl-nvl("+equSbdhArr.getDhsl()+",0) where conid='"+equSbdhArr.getConid()+"' and sb_id='"+equSbdhArr.getSbId()+"'";
				//JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
				//jdbc.update(sql);
				//删除设备
				this.equipmentDAO.delete(equSbdhArr);
			}
		} catch (Exception e) {
			e.printStackTrace();
			flag = false;
		}
		return flag;
	}
	
	/**
	 * 删除到货记录，同时删除改到货记录从表的设备，并更新该设备的总到货数
	 * @param ggid 到货单主键
	 * @param type
	 * @author zhangh
	 * @since 2011-03-07
	 */
	public void deleteGetGoods(String ggid, String type){
		try {
			if (!"".equals(type)){
				//根据到货单主键删除到货从表数据
				List list = this.equipmentDAO.findByProperty(goodsSubBean, "dhId", ggid);
				String[] uuids=new String[list.size()];
				for (int i = 0; i < list.size(); i++) {
					EquSbdhArr equSbdhArr = (EquSbdhArr) list.get(i);
					uuids[i] = equSbdhArr.getUuid();
				}
				this.deleteGetGoodsSub(uuids);
			}
			EquGetGoodsArr equGetGoods = (EquGetGoodsArr)this.equipmentDAO.findById(beanName, ggid);
			this.equipmentDAO.delete(equGetGoods);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 保存修改后的到货记录，同时更新总到货数
	 * @param equSbdhArr
	 * @param conid 合同编号
	 * @return
	 */
	public String saveGetGoodsSub(EquSbdhArr[] equSbdhArr,String conid){
		try {
			for (int i = 0; i < equSbdhArr.length; i++) {
				this.equipmentDAO.saveOrUpdate(equSbdhArr[i]);
				//保存后更新总到货数
				String sql="update equ_list set dhzsl=(select sum(dhsl) from equ_sbdh_arr where conid='"+conid+"' and sb_id='"+equSbdhArr[i].getSbId()+"') where conid='"+conid+"' and sb_id='"+equSbdhArr[i].getSbId()+"'";
				this.equipmentDAO.updateBySQL(sql);
			}
			return "1";
		} catch (Exception e) {
			e.printStackTrace();
			return "0";
		}
	}
}

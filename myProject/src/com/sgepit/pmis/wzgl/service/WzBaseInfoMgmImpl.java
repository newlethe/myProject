package com.sgepit.pmis.wzgl.service;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;

import net.sf.json.JSONObject;

import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.hbm.SgccAttachBlob;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.contract.hbm.ConOve;
import com.sgepit.pmis.equipment.hbm.EquGoodsFinishedRecord;
import com.sgepit.pmis.equipment.hbm.EquGoodsTz;
import com.sgepit.pmis.equipment.hbm.EquWarehouse;
import com.sgepit.pmis.material.hbm.MatStoreInsub;
import com.sgepit.pmis.wzgl.dao.WZglDAO;
import com.sgepit.pmis.wzgl.hbm.ConMat;
import com.sgepit.pmis.wzgl.hbm.WzBm;
import com.sgepit.pmis.wzgl.hbm.WzBmwh;
import com.sgepit.pmis.wzgl.hbm.WzCkclb;
import com.sgepit.pmis.wzgl.hbm.WzConBodyTreeView;
import com.sgepit.pmis.wzgl.hbm.WzConOveTreeView;
import com.sgepit.pmis.wzgl.hbm.WzCsb;
import com.sgepit.pmis.wzgl.hbm.WzCsbType;
import com.sgepit.pmis.wzgl.hbm.WzGoodsArrival;
import com.sgepit.pmis.wzgl.hbm.WzGoodsArrivalSmsUser;
import com.sgepit.pmis.wzgl.hbm.WzGoodsArrivalSub;
import com.sgepit.pmis.wzgl.hbm.WzGoodsBodys;
import com.sgepit.pmis.wzgl.hbm.WzGoodsOpenbox;
import com.sgepit.pmis.wzgl.hbm.WzGoodsOpenboxNotice;
import com.sgepit.pmis.wzgl.hbm.WzGoodsOpenboxNoticeSub;
import com.sgepit.pmis.wzgl.hbm.WzGoodsOpenboxResult;
import com.sgepit.pmis.wzgl.hbm.WzGoodsOpenboxSub;
import com.sgepit.pmis.wzgl.hbm.WzGoodsOpenboxSubPart;
import com.sgepit.pmis.wzgl.hbm.WzGoodsOutBack;
import com.sgepit.pmis.wzgl.hbm.WzGoodsOutBackSub;
import com.sgepit.pmis.wzgl.hbm.WzGoodsOutEstimate;
import com.sgepit.pmis.wzgl.hbm.WzGoodsOutEstimateSub;
import com.sgepit.pmis.wzgl.hbm.WzGoodsStock;
import com.sgepit.pmis.wzgl.hbm.WzGoodsStockOut;
import com.sgepit.pmis.wzgl.hbm.WzGoodsStockOutSub;
import com.sgepit.pmis.wzgl.hbm.WzGoodsStorein;
import com.sgepit.pmis.wzgl.hbm.WzGoodsStoreinBack;
import com.sgepit.pmis.wzgl.hbm.WzGoodsStoreinBackSub;
import com.sgepit.pmis.wzgl.hbm.WzGoodsStoreinEstimate;
import com.sgepit.pmis.wzgl.hbm.WzGoodsStoreinEstimateSub;
import com.sgepit.pmis.wzgl.hbm.WzGoodsStoreinSub;
import com.sgepit.pmis.wzgl.hbm.WzUserCkclb;
import com.sgepit.pmis.wzgl.hbm.WzglConOveTreeView;

public class WzBaseInfoMgmImpl implements WzBaseInfoMgmFacade {
	private WZglDAO wzglDAO;
	
	public static WzBaseInfoMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (WzBaseInfoMgmImpl) ctx.getBean("wzBaseInfoMgmImpl");
	}


	/**
	 * zhangxb 物资分类Tree
	 */
	public List<ColumnTreeNode> getWzBmTree(String parentId,String pid){
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId: "root";
		StringBuffer bfs = new StringBuffer();
		bfs.append("parentbm='" + parent + "'");
		if (pid!=null && pid.length()>0) {
			bfs.append(" and pid = '"+pid+"' ");
		}
		bfs.append(" order by bm ");
		List modules = this.wzglDAO.findByWhere("com.sgepit.pmis.wzgl.hbm.WzCkclb", bfs.toString());
		Iterator<WzCkclb> itr = modules.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			WzCkclb temp = (WzCkclb) itr.next();
			int leaf = Integer.parseInt(temp.getIsleaf());			
			n.setId(temp.getBm());			// treenode.id
			n.setText(temp.getPm());		// treenode.text
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("icon-cmp");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("icon-pkg");		// treenode.cls
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}
	
	/**
	 * zhangxb 供应商地域分类功能树
	 */
	public List<ColumnTreeNode> getcsBmTree(String parentId,String pid) {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId: "root";
		StringBuffer bfs = new StringBuffer();
		bfs.append("parentbm='" + parent + "' and pid = '"+pid+"' ");
		bfs.append(" order by bm ");
		List modules = this.wzglDAO.findByWhere("com.sgepit.pmis.wzgl.hbm.WzCsbType", bfs.toString());
		Iterator<WzCsbType> itr = modules.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			WzCsbType temp = (WzCsbType) itr.next();
			int leaf = Integer.parseInt(temp.getIsleaf());			
			n.setId(temp.getBm());			// treenode.id
			n.setText(temp.getPm());		// treenode.text
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("icon-cmp");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("icon-pkg");		// treenode.cls
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;		
	}
	
	/**
	 * zhangxb 人员角色下的物资范围选择分类Tree
	 */
	public List<ColumnTreeNode> getWzBmTreeCheck(String parentId,String userid,String userrole,String pid){
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId: "root";
		StringBuffer bfs = new StringBuffer();
		bfs.append("parentbm='" + parent + "' and pid = '"+pid+"' ");
		bfs.append(" order by bm ");
		List modules = this.wzglDAO.findByWhere("com.sgepit.pmis.wzgl.hbm.WzCkclb", bfs.toString());
		Iterator<WzCkclb> itr = modules.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			WzCkclb temp = (WzCkclb) itr.next();
			int leaf = Integer.parseInt(temp.getIsleaf());			
			n.setId(temp.getBm());			// treenode.id
			n.setText(temp.getPm());		// treenode.text
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("icon-cmp");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("icon-pkg");		// treenode.cls
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			
			List it = this.wzglDAO.findByWhere("com.sgepit.pmis.wzgl.hbm.WzUserCkclb",
					"bm ='"+temp.getBm()+"' and userid='"+userid+"' and userrole='"+userrole+"' and pid='"+pid+"'");
			if(leaf == 1 && it !=null && it.size()>0){
				jo.accumulate("ischeck", "true");
			}else{
				jo.accumulate("ischeck", "false");
			}
			
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}

	
	/**
	 * zhangxb 物资编码--人员角色---保存
	 */
	public void saveGetResPersonTree(String userid, String userrole, String pid, String[] bm) {
		for(int i = 0;i<bm.length;i++){
			WzUserCkclb wzuc = new WzUserCkclb();
			
			List list = this.wzglDAO.findByWhere("com.sgepit.pmis.wzgl.hbm.WzUserCkclb", "bm = '"+bm[i]+"' and userid='"+userid+"' and userrole='"+userrole+"' and pid='"+pid+"'");
			if(list.size()>0) continue;
			wzuc.setBm(bm[i]);
			wzuc.setUserid(userid);
			wzuc.setUserrole(userrole);
			wzuc.setPid(pid);
			wzglDAO.insert(wzuc);
		}
		
	}
	
	/**
	 * zhangxb 检查物资编码的唯一性 
	 */
	public boolean checkBMno(String bm){
		List list = this.wzglDAO.findByProperty("com.sgepit.pmis.wzgl.hbm.WzBm", "bm", bm);
		if(list.size()>0) return false;
		return true;
	}
	
	/**
	 * zhangxb 检查供应商编码的唯一性 
	 */
	public boolean checkCSno(String csdm){
		List list = this.wzglDAO.findByProperty("com.sgepit.pmis.wzgl.hbm.WzCsb", "csdm", csdm);
		if(list.size()>0) return false;
		return true;
	}
	
	/**
	 * zhangxb 物资仓库分类添加修改
	 */
	public int addOrUpdateWzCkclb(WzCkclb ckclb) {
		int flag = 0;
		String beanname="com.sgepit.pmis.wzgl.hbm.WzCkclb";
		try{
			if("".equals(ckclb.getUids())||ckclb.getUids()==null){//新增
				//是否有同级节点
				List list = this.wzglDAO.findByProperty(beanname, "parent", ckclb.getParent());
				if(list.isEmpty()){//如果新增节点是其父节点的第一个子节点，修改父节点状态
					//得到父节点主id
					List<WzCkclb> listBm = this.wzglDAO.findByProperty(beanname,"bm",ckclb.getParent());
					Iterator<WzCkclb> it = listBm.iterator();
					String uids="";
					while(it.hasNext()){
						uids = it.next().getUids();
						if(uids!="")break;
					}
					
					//更新父节点
					WzCkclb parentwzck = (WzCkclb)this.wzglDAO.findById(beanname,uids);
					parentwzck.setIsleaf("0");
					this.updateWzCkclb(parentwzck);
				}
				this.saveWzCkclb(ckclb);
				flag=1;
			}else{//修改
				this.updateWzCkclb(ckclb);
				flag = 2;
			}
		} catch (Exception e) {
			flag = 0;
			e.printStackTrace();
		}
		return flag;
	}

	/**
	 * zhangxb 物资仓库分类删除
	 */
	public int deleteWzCkclb(String uids) {
		int flag = 0;
		try{
			String beanName = "com.sgepit.pmis.wzgl.hbm.WzCkclb";
			WzCkclb wzckclb = (WzCkclb)this.wzglDAO.findById(beanName,uids);
			List list = this.wzglDAO.findByProperty(beanName, "parent",wzckclb.getParent());
			if(list != null){
				if(list.size()==1){//删除的节点为其父节点的最后一个，更新父节点
					WzCkclb sort = (WzCkclb)this.wzglDAO.findBeanByProperty(beanName,"bm",wzckclb.getParent());
					sort.setIsleaf("1");
					this.updateWzCkclb(wzckclb);
				}
				this.wzglDAO.delete(wzckclb);
				flag=1;
			}else{
				flag=0;
			}
		} catch (Exception e) {
			flag = 0;
			e.printStackTrace();
		}
		return flag;
	}
	
	public void saveWzCkclb(WzCkclb ckclb) {
		this.wzglDAO.insert(ckclb);
	}
	
	public void updateWzCkclb(WzCkclb ckclb){
		this.wzglDAO.saveOrUpdate(ckclb);
	}
	
	/**
	 * zhangxb 供应商地域分类添加修改
	 */
	public int addOrUpdateWzCsType(WzCsbType csbtype) {
		int flag = 0;
		String beanname="com.sgepit.pmis.wzgl.hbm.WzCsbType";
		try{
			if("".equals(csbtype.getUids())||csbtype.getUids()==null){//新增
				//是否有同级节点
				List list = this.wzglDAO.findByProperty(beanname, "parent", csbtype.getParent());
				if(list.isEmpty()){//如果新增节点是其父节点的第一个子节点，修改父节点状态
					//得到父节点主id
					List<WzCsbType> listBm = this.wzglDAO.findByProperty(beanname,"bm",csbtype.getParent());
					Iterator<WzCsbType> it = listBm.iterator();
					String uids="";
					while(it.hasNext()){
						uids = it.next().getUids();
						if(uids!="")break;
					}
					
					//更新父节点
					WzCsbType parentwzck = (WzCsbType)this.wzglDAO.findById(beanname,uids);
					parentwzck.setIsleaf("0");
					this.updateWzCsType(parentwzck);
				}
				this.saveWzCsType(csbtype);
				flag=1;
			}else{//修改
				this.updateWzCsType(csbtype);
				flag = 2;
			}
		} catch (Exception e) {
			flag = 0;
			e.printStackTrace();
		}
		return flag;
	}
	
	
	/**
	 * zhangxb 供应商地域分类删除
	 */
	public int deleteWzCsType(String uids) {
		int flag = 0;
		try{
			String beanName = "com.sgepit.pmis.wzgl.hbm.WzCsbType";
			WzCsbType csbtype = (WzCsbType)this.wzglDAO.findById(beanName,uids);
			List list = this.wzglDAO.findByProperty(beanName, "parent",csbtype.getParent());
			if(list != null){
				if(list.size()==1){//删除的节点为其父节点的最后一个，更新父节点
					WzCsbType sort = (WzCsbType)this.wzglDAO.findBeanByProperty(beanName,"bm",csbtype.getParent());
					sort.setIsleaf("1");
					this.updateWzCsType(csbtype);
				}
				this.wzglDAO.delete(csbtype);
				flag=1;
			}else{
				flag=0;
			}
		} catch (Exception e) {
			flag = 0;
			e.printStackTrace();
		}
		return flag;
	}
	
	public void saveWzCsType(WzCsbType csbtype) {
		this.wzglDAO.insert(csbtype);
	}
	
	public void updateWzCsType(WzCsbType csbtype){
		this.wzglDAO.saveOrUpdate(csbtype);
	}
	
	
	/**
	 * zhangxb 关于物资编码添加修改
	 */
	public String addOrUpdateWzBm(WzBm wzbm) {
		String flag = "0";
		try{
			if("".equals(wzbm.getUids())||wzbm.getUids()==null){//新增
				wzbm.setBmState("1");//默认为启用
				this.saveWzBm(wzbm);
				flag="1";
			}else{//修改
				Context initCtx = new InitialContext();
				
				DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
				Connection conn = ds.getConnection();
				Statement stmt = conn.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_READ_ONLY);
				ResultSet rs = stmt.executeQuery("select sl from wz_bm where uids ='"+wzbm.getUids()+"'");
				double historySL = 0;
				while(rs.next()){
					historySL = rs.getDouble(1);
				}
				
				JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
				
				if(wzbm.getSl() >0 && historySL ==0){//如果原来的库存数量为0，并且现在的库存大于0
					//更新申请计划表wz_cjsxb
					String [] sql = new String[4];
				    sql[0] = "update wz_cjsxb set dj='"+wzbm.getJhdj()+"' where uids in ("+
						" select wz_cjsxb.uids  from wz_cjsxb,wz_cjspb where wz_cjspb.uids =  wz_cjsxb.bh "+
						" and (wz_cjspb.bill_state = '-1' or wz_cjspb.bill_state = '0' "+
						" or (wz_cjspb.bill_state = '1'and wz_cjsxb.ftsl - wz_cjsxb.ffsl >0))"+
						" and bm = '"+wzbm.getBm()+"')" ;
					//更新采购计划表
					 sql[1] = " update wz_cjhxb set dj="+wzbm.getJhdj()+" where bm='"+wzbm.getBm()+"' and (dhsl-ygsl<0 and is_complete=0) ";
					//更新到货记录表
					sql[2] = "  update wz_input set jhdj="+wzbm.getJhdj()+" where bm='"+wzbm.getBm()+"' and ( NLS_LOWER(bill_state)='n' or bill_state is null) ";
					//更新领用单表
				    sql[3] = " update wz_output  set jhdj="+wzbm.getJhdj()+" where bm='"+wzbm.getBm()+"' and  NLS_LOWER(bill_state)='n'";
					//更新物资编码表
				    jdbc.batchUpdate(sql);
				}
				
				//更新物资编码表
				this.updateWzBm(wzbm);
				flag = "2";
			}
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}
	
	/**
	 * zhangxb 关于供应商信息添加修改
	 */
	public String addOrUpdateWzCsb(WzCsb wzcsb) {
		String flag = "0";
		try{
			if("".equals(wzcsb.getUids())||wzcsb.getUids()==null){//新增
				wzcsb.setIsused("1");//默认为启用
				this.wzglDAO.insert(wzcsb);
				flag="1";
			}else{//修改
				//更新物资编码表
				this.wzglDAO.saveOrUpdate(wzcsb);
				flag = "2";
			}
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}
	/**
	 * zhangxb 供应商 启用?禁用
	 */
	public boolean updateWzCsStateChange(String uids,String flag) {
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate(); 
		String [] uidsArr = uids.split(",");
		for(int i=0 ; i< uidsArr.length; i++){
			jdbc.update(" update wz_csb set isused='"+flag+"' where uids='"+uidsArr[i]+"' ");
		}
		return true;		
		
		/*JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate(); 
		String sql = " update wz_csb set isused='"+flag+"' where uids='"+uids+"' " ;
		jdbc.update(sql);
		return true;*/
	}
	
	
	
	/**
	 * zhangxb 关于物资编码删除
	 */
	public boolean deleteWzBm(String uids) {
		
		return false;
	}
	
	/**
	 * zhangxb 编码申请退回
	 */
	public boolean updateWzbmStateChange(String uids,String flag) {
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate(); 
		String [] uidsArr = uids.split(",");
		for(int i=0 ; i< uidsArr.length; i++){
			jdbc.update(" update wz_bm set bm_state='"+flag+"' where uids='"+uidsArr[i]+"' ");
		}
		//String sql = " update wz_bm set bm_state='"+flag+"' where uids='"+uids+"' " ;
		//jdbc.update(sql);
		return true;
	}
	
	public void saveWzBm(WzBm wzbm) {
		this.wzglDAO.insert(wzbm);
	}
	
	
	public void updateWzBm(WzBm wzbm) {
		this.wzglDAO.saveOrUpdate(wzbm);
	}

	
	/**
	 * zhangxb 编码申请添加修改
	 */
	public String addOrUpdateWzBmApply(WzBmwh wzbmwh) {
		String flag = "0";
		try{
			if("".equals(wzbmwh.getBh())||wzbmwh.getBh()==null){//新增
				wzbmwh.setQr("-1");
				this.wzglDAO.insert(wzbmwh);
				flag="1";
			}else{//修改
				this.wzglDAO.saveOrUpdate(wzbmwh);
				flag = "2";
			}
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}
	
	/**
	 * zhangxb 编码申请删除
	 */
	public boolean deleteWzBmApply(String bh) {
		return false;
	}
	
	/**
	 * zhangxb 编码申请退回
	 */
	public boolean updateWzbmConfirmReturn(String bh) {
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate(); 
		String sql = " update wz_bmwh set qr=0 where bh='"+bh+"' " ;
		jdbc.update(sql);
		return true;
	}
	
	/**
	 * zhangxb 编码申请添加修改
	 */
	public String addOrUpdateWzBmConfirm(WzBmwh wzbmwh) {
		String flag = "0";
		try{
			//更新编码维护表中状态
			wzbmwh.setQr("1");//确认
			this.wzglDAO.saveOrUpdate(wzbmwh);
			
			//wzbm表插入插入数据
			WzBm wzbm = new WzBm();
			wzbm.setBm(wzbmwh.getWzbm());
			wzbm.setCkh(wzbmwh.getCkh());
			wzbm.setPm(wzbmwh.getPm());
			wzbm.setGg(wzbmwh.getGg());
			wzbm.setDw(wzbmwh.getDw());
			wzbm.setJhdj(wzbmwh.getDj());
			wzbm.setBz(wzbmwh.getBz());
			wzbm.setStage(wzbmwh.getStage());
			wzbm.setFlbm(wzbmwh.getFlbm());
			wzbm.setBmState("1");
			wzbm.setPid(wzbmwh.getPid());
			wzbm.setSl((double)0);
			
			this.wzglDAO.saveOrUpdate(wzbm);
			
			flag="1";
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}
/**
 * 删除物资人员，和其相关的物资范围，仓库管理员(roleid=1)
 */
	public boolean delWzUser(String userid, String roleid) {
		boolean flag=false;
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		try{
			String [] sql = new String[3];
			sql[0] = "delete from wz_user where userid='"+userid+"' and userrole='"+roleid+"'";
			sql[1] = "delete from wz_user_ckclb where userid='"+userid+"' and userrole='"+roleid+"'";
			sql[2] = "delete from wz_ckh_user where userid='"+userid+"' and userrole='"+roleid+"'";
			jdbc.batchUpdate(sql);
			flag = true;
		}catch(Exception e){
			flag=false;
			e.printStackTrace();
		}
		return flag;
		
	}
	public String getNewbm(String flbm, String pid){
		String max_bm="";
		String sql="select nvl(substr(max(bm),-5)+1,1) from wz_bm where flbm='"+flbm+"' and pid='"+pid+"' ";
		List list =this.wzglDAO.getDataAutoCloseSes(sql);
		max_bm=list.get(0).toString();
		for(int i=max_bm.length();i<5;i++){
			flbm+="0";
		}
		return flbm+max_bm;
	}
	
	
	
	
	public WZglDAO getWzglDAO() {
		return wzglDAO;
	}
	
	public void setWzglDAO(WZglDAO wzglDAO) {
		this.wzglDAO = wzglDAO;
	}


	public String getNewWzBm(String flbm){	
		String strbm="01";
		String newbm=null;
		String newLsh = "";
		String sql = "select substr(lpad(max(nvl(substr(bm,length('" + flbm + "')+1),0)),3,1)+1,2,2) from wz_ckclb where parentbm='"+flbm+"'";
		List<String> list =  this.wzglDAO.getDataAutoCloseSes(sql);
		 if(list.get(0)!=null){
			 if(list.get(0)==""){					 
					 newLsh=newLsh.concat(strbm);
			 }else{
			 newLsh = list.get(0);
			 }
		 }else if(list.get(0)==null){
				 newLsh=newLsh.concat(strbm);
		 }
		 newbm= flbm.concat(newLsh);
		 return newbm;

	} 
	
	@SuppressWarnings("unchecked")
	public String getStockWzBm(String prefix,String pid){
		String strbm="1";
		String newbm=null;
		String newLsh = "";
		if(prefix.length()<=12){
		String sql = "select lpad(max(nvl(substr(bm,length('" + prefix + "')+1),0))+1,12-length('"+prefix+"'),0) from wz_bm where substr(bm,1,length('" + prefix + "')) ='" +  prefix +"' and pid = '"+pid+"'";
		List<String> list =  this.wzglDAO.getDataAutoCloseSes(sql);
		System.out.println(list.get(0));
		 if(list.get(0)!=null){
			 if(list.get(0)==""){
				 for(int i=0;i<11-prefix.length();i++){
					 	newLsh = newLsh.concat("0");
					 }
					 newLsh=newLsh.concat(strbm);
			 }else{
			 newLsh = list.get(0);
			 }
		 }else if(list.get(0)==null){
			 for(int i=0;i<(11-prefix.length());i++){	
					newLsh = newLsh.concat("0");
				 }
				 newLsh=newLsh.concat(strbm);
		 }
		 newbm= prefix.concat(newLsh);
		}
		else if(prefix.length()>12){
			String sql = "select max(nvl(substr(bm,length('" + prefix + "')+1),0))+1 from wz_bm where substr(bm,1,length('" + prefix+ "'))='" +  prefix +"'";
			List<String> list =  this.wzglDAO.getDataAutoCloseSes(sql);
			if(list.get(0)!=null){
				if(list.get(0)==""){
					newLsh = newLsh.concat("1");
				}
				newLsh = list.get(0);
			}
			else if(list.get(0)==null){
				newLsh = newLsh.concat("1");
			}
			newbm= prefix.concat(newLsh);
		}
		return newbm;
	}

	public List<ColumnTreeNode> WzTypeTreeList(String parentId, String whereStr, String conid) {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String [] parentIf=parentId.split("`");
		String treeIdIf="";
		if(parentIf.length>1){
			treeIdIf=parentIf[1];
		}
		parentId=parentIf[0];
		String str="";
		
		if(parentId!=null &&!"".equals(parentId)){
		   str = " parentid='"+parentId+"'";
		}else {
			 str = "start with  parentid='0'";
		}
		if(conid!=null &&!"".equals(conid)){
			str +=" and conid='" + conid + "'";
		}
		if(treeIdIf !=null &&!"".equals(treeIdIf)){
			str +=" and treeid not in ('" + treeIdIf + "')";
		}
//		"select *from equ_con_ove_tree_view start with  parentid='006' connect by prior  treeid = parentid  and conid =''"
		List<WzConOveTreeView> list1 = this.wzglDAO.findByWhere2(WzConOveTreeView.class.getName(),str);
		//JdbcUtil.query(sql);
		//List<EquListQc> objects = this.equipmentDAO.findByWhere2(BusinessConstants.EQU_PACKAGE.concat("EquListQc"), str);
		//Iterator<EquListQc> itr = objects.iterator();
		for(int i=0;i<list1.size();i++){
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			WzConOveTreeView ecotv = (WzConOveTreeView) list1.get(i);
			Long leaf = ecotv.getIsleaf();			
			n.setId(ecotv.getTreeid());
			n.setText(ecotv.getName());
			
			//n.setId(temp.getSbid());			// treenode.id
			//n.setText(temp.getSbMc());		// treenode.text
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("icon-cmp");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("icon-pkg");	// treenode.iconCls   icon-pkg 文件夹样式    task-folder
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(ecotv);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}

	@SuppressWarnings("unchecked")
	public String setWzSmsUserFun(String arrivalid, String userid, Boolean bool) {
		WzGoodsArrival arrival = (WzGoodsArrival) this.wzglDAO.findById(WzGoodsArrival.class.getName(), arrivalid);
		List<WzGoodsArrivalSmsUser> list = this.wzglDAO.findByWhere(WzGoodsArrivalSmsUser.class.getName(),
				"arrivalid='" + arrivalid + "' and userid = '" + userid + "'");
		if (arrival != null) {
			if (bool) {
				if (list.size() == 0) {
					WzGoodsArrivalSmsUser smsUser = new WzGoodsArrivalSmsUser();
					smsUser.setUserid(userid);
					smsUser.setArrivalid(arrivalid);
					this.wzglDAO.insert(smsUser);
				}

				if (arrival.getSetUser() == null || !arrival.getSetUser().equals("1")) {
					arrival.setSetUser("1");
					this.wzglDAO.saveOrUpdate(arrival);
				}
			} else {
				this.wzglDAO.deleteAll(list);

				List<Object> smsUserList = this.wzglDAO.findByWhere(
						WzGoodsArrivalSmsUser.class.getName(), "arrivalid='" + arrivalid + "'");
				if (smsUserList.size() == 0) {
					arrival.setSetUser("0");
					this.wzglDAO.saveOrUpdate(arrival);
				}
			}
			return "1";
		} else {
			return "0";
		}
	}

	public String WzArrivalFinished(String uids) {
		WzGoodsArrival arrival = (WzGoodsArrival) this.wzglDAO.findById(WzGoodsArrival.class.getName(), uids);
		if (arrival == null)
			return "0";
		if (arrival.getIsOpen() == 1) {
			return "2";
		}
		Integer i = arrival.getFinished();
		arrival.setFinished((i == null || i == 0) ? 1 : 0);
		this.wzglDAO.saveOrUpdate(arrival);
		return "1";
	}

	public void sendSmsByWzGoodsArrival(String uids) {
		try {
			InputStream is = this.getClass().getResourceAsStream("/sendmessage_sgcc.properties");
			Properties props = new Properties();
			props.load(is);
			// 是否需要发送短信
			String isSendMessage = props.getProperty("IS_SENDMESSAGE");
			is.close();
			System.out.println("是否开启短信：" + isSendMessage);
			if (isSendMessage.equals("true")) {
				WzGoodsArrival arrival = (WzGoodsArrival) this.wzglDAO.findById(WzGoodsArrival.class.getName(), uids);
				if (arrival == null)
					return;
				ConOve conOve = (ConOve) this.wzglDAO.findById(ConOve.class.getName(), arrival.getConid());
				if (conOve == null)
					return;
				// 查询提醒用户
				List<WzGoodsArrivalSmsUser> listSmsUser = this.wzglDAO.findByWhere(
						WzGoodsArrivalSmsUser.class.getName(), "arrivalid='" + uids + "'");
				for (int j = 0; j < listSmsUser.size(); j++) {
					WzGoodsArrivalSmsUser smsUser = listSmsUser.get(j);
					if (smsUser.getIssend() != null && smsUser.getIssend().equals("1"))
						continue;
					// 查询用户
					RockUser user = (RockUser) this.wzglDAO.findById(RockUser.class.getName(), smsUser.getUserid());
					if (user.getMobile() == null || user.getMobile().equals(""))
						continue;
					String content = user.getRealname() + "，您有一条到货通知单。"
							+ " 到货时间：" + arrival.getDhDate() + "，" + " 交接地点："
							+ arrival.getJoinPlace() + "，" + " 到货物品："
							+ arrival.getDhDesc() + "，" + " 合同编号："
							+ conOve.getConno() + "，" + " 合同名称："
							+ conOve.getConname() + "，"
							+ " 请届时务必参加。详细信息查询基建MIS。";
					// 短信接收号码
//					String mobile = user.getMobile();
//					this.sendMessage.sendASms(content, mobile);
					System.out.println("短信发送成功！");
					smsUser.setIssend("1");
					this.wzglDAO.saveOrUpdate(smsUser);
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	@SuppressWarnings("unchecked")
	public String deleteArrival(String uids) {
		// 删除从表数据
		List<WzGoodsArrivalSub> list = this.wzglDAO.findByWhere(WzGoodsArrivalSub.class.getName(), "arrivalId = '" + uids + "'");
		if (list.size() > 0)
			this.wzglDAO.deleteAll(list);
		// 删除附件数据
		List<SgccAttachList> listFile = this.wzglDAO.findByWhere(
				SgccAttachList.class.getName(), "transaction_id = '" + uids + "'");
		if (listFile.size() > 0) {
			for (int i = 0; i < listFile.size(); i++) {
				SgccAttachList sal = listFile.get(i);
				List<SgccAttachBlob> list1 = this.wzglDAO.findByWhere(
						SgccAttachBlob.class.getName(), "file_lsh = '" + sal.getFileLsh() + "'");
				this.wzglDAO.deleteAll(list1);
			}
			this.wzglDAO.deleteAll(listFile);
		}
		WzGoodsArrival arrival = (WzGoodsArrival) this.wzglDAO.findById(WzGoodsArrival.class.getName(), uids);
		this.wzglDAO.delete(arrival);
		// 删除对应短信提醒人
		List<Object> listSmsUser = this.wzglDAO.findByWhere(
				WzGoodsArrivalSmsUser.class.getName(), "arrivalid = '" + uids + "'");
		if (listSmsUser.size() > 0)
			this.wzglDAO.deleteAll(listSmsUser);
		return "1";
	}

	public String addOrUpdateWzArrival(WzGoodsArrival arrival) {
		String uids = arrival.getUids();
		// 判断该到货是否已经开箱
		if (uids == null || uids.equals("")) {
			this.wzglDAO.insert(arrival);
			return arrival.getUids();
		} else {
			this.wzglDAO.saveOrUpdate(arrival);
			return arrival.getUids();
		}
	}

	public String addOrUpdateWzOpenboxNotice(WzGoodsOpenboxNotice notice) {
		String uids = notice.getUids();
		if (uids == null || uids.equals("")) {
			this.wzglDAO.insert(notice);
			return notice.getUids();
		} else {
			this.wzglDAO.saveOrUpdate(notice);
			return notice.getUids();
		}
	}

	public String insertWzNoticeSubFromArrivalSub(String[] uids, String id, String no) {
		for (int i = 0; i < uids.length; i++) {
			WzGoodsArrivalSub arrivalSub = (WzGoodsArrivalSub) this.wzglDAO.findById(WzGoodsArrivalSub.class.getName(), uids[i]);
			if (arrivalSub != null) {
				WzGoodsOpenboxNoticeSub sub = new WzGoodsOpenboxNoticeSub();
				sub.setNoticeId(id);
				sub.setNoticeNo(no);
				sub.setPid(arrivalSub.getPid());

				sub.setBoxType(arrivalSub.getBoxType());
				sub.setJzNo(arrivalSub.getJzNo());
				sub.setBoxNo(arrivalSub.getBoxNo());
				sub.setBoxName(arrivalSub.getBoxName());
				sub.setGgxh(arrivalSub.getGgxh());
				sub.setGraphNo(arrivalSub.getGraphNo());
				sub.setUnit(arrivalSub.getUnit());
				sub.setOpenNum(arrivalSub.getRealNum());
				sub.setWeight(arrivalSub.getWeight());
				sub.setArrivalSubId(uids[i]);
				sub.setArrivalNo(arrivalSub.getArrivalNo());
				this.wzglDAO.saveOrUpdate(sub);

				String sql = "update wz_goods_arrival set is_open=1 "
						+ " where uids = '" + arrivalSub.getArrivalId() + "'";
				JdbcUtil.update(sql);
			}
		}
		return "1";
	}

	public String addOrUpdateWzOpenbox(WzGoodsOpenbox openbox) {
		String uids = openbox.getUids();
		if (uids == null || uids.equals("")) {
			this.wzglDAO.insert(openbox);
			return openbox.getUids();
		} else {
			this.wzglDAO.saveOrUpdate(openbox);
			return openbox.getUids();
		}
	}

	public void deleteWzOpenboxSub(String openboxUids) {
		List<WzGoodsOpenboxSub> list = this.wzglDAO.findByWhere(
				WzGoodsOpenboxSub.class.getName(), "openboxId = '" + openboxUids + "'");
		if (list != null && list.size() > 0) {
			this.wzglDAO.deleteAll(list);
		}
	}

	public String getWzOpenboxSubFromNotice(String openboxUids, String noticeUids) {
		deleteWzOpenboxSub(openboxUids);

		WzGoodsOpenbox openbox = (WzGoodsOpenbox) this.wzglDAO.findById(WzGoodsOpenbox.class.getName(), openboxUids);
		WzGoodsOpenboxNotice notice = (WzGoodsOpenboxNotice) this.wzglDAO.findById(WzGoodsOpenboxNotice.class.getName(), noticeUids);
		openbox.setNoticeId(notice.getUids());
		openbox.setNoticeNo(notice.getNoticeNo());
		this.wzglDAO.saveOrUpdate(openbox);

		List<WzGoodsOpenboxNoticeSub> list = this.wzglDAO.findByWhere(
				WzGoodsOpenboxNoticeSub.class.getName(), "noticeId='" + noticeUids + "'");
		for (int i = 0; i < list.size(); i++) {
			WzGoodsOpenboxSub sub = new WzGoodsOpenboxSub();
			sub.setOpenboxId(openbox.getUids());
			sub.setOpenboxNo(openbox.getOpenNo());

			WzGoodsOpenboxNoticeSub noticeSub = list.get(i);
			WzGoodsArrivalSub arrivalSub = (WzGoodsArrivalSub) this.wzglDAO.findById(WzGoodsArrivalSub.class.getName(), noticeSub.getArrivalSubId());
			if (arrivalSub == null)
				return "0";
			sub.setPid(arrivalSub.getPid());

			sub.setBoxType(arrivalSub.getBoxType());
			sub.setJzNo(arrivalSub.getJzNo());
			sub.setBoxNo(arrivalSub.getBoxNo());
			sub.setBoxName(arrivalSub.getBoxName());
			sub.setGgxh(arrivalSub.getGgxh());
			sub.setGraphNo(arrivalSub.getGraphNo());
			sub.setUnit(arrivalSub.getUnit());
			sub.setMustNum(arrivalSub.getMustNum());
			sub.setRealNum(arrivalSub.getRealNum());
			sub.setWeight(arrivalSub.getWeight());
			sub.setPackType(arrivalSub.getPackType());
			sub.setStorage(arrivalSub.getStorage());
			sub.setException(arrivalSub.getException());
			sub.setExceptionDesc(arrivalSub.getExceptionDesc());
			sub.setRemark(arrivalSub.getRemark());

			this.wzglDAO.saveOrUpdate(sub);
		}

		String sql = "update wz_goods_openbox_notice set is_check=1 where uids = '" + noticeUids + "'";
		JdbcUtil.update(sql);

		return "1";
	}

	@SuppressWarnings("unchecked")
	public String deleteWzOpenbox(String uids) {
		// 删除从表数据
		List<WzGoodsOpenboxSub> list1 = this.wzglDAO.findByWhere(WzGoodsOpenboxSub.class.getName(),
				"openboxId = '" + uids + "'");
		if (list1.size() > 0)
			this.wzglDAO.deleteAll(list1);
		// 删除检验结果
		List<WzGoodsOpenboxResult> list3 = this.wzglDAO.findByWhere(WzGoodsOpenboxResult.class.getName(),
				"openboxId = '" + uids + "'");
		if (list3.size() > 0)
			this.wzglDAO.deleteAll(list3);
		// 删除附件数据
		List<SgccAttachList> listFile = this.wzglDAO.findByWhere(
				SgccAttachList.class.getName(), "transaction_id = '" + uids + "'");
		if (listFile.size() > 0) {
			for (int i = 0; i < listFile.size(); i++) {
				SgccAttachList sal = listFile.get(i);
				List<SgccAttachBlob> list4 = this.wzglDAO.findByWhere(SgccAttachBlob.class.getName(), "file_lsh='" + sal.getFileLsh() + "'");
				this.wzglDAO.deleteAll(list4);
			}
			this.wzglDAO.deleteAll(listFile);
		}
		// 删除开箱检验单主表
		WzGoodsOpenbox openbox = (WzGoodsOpenbox) this.wzglDAO.findById(WzGoodsOpenbox.class.getName(), uids);
		this.wzglDAO.delete(openbox);
		return "1";
	}

	public String wzOpenboxFinished(String uids) {
		WzGoodsOpenbox openbox = (WzGoodsOpenbox) this.wzglDAO.findById(WzGoodsOpenbox.class.getName(), uids);
		if (openbox == null)
			return "0";
		List<WzGoodsOpenboxResult> list = this.wzglDAO.findByWhere(
				WzGoodsOpenboxResult.class.getName(), "openboxId='" + uids + "'");
		if (list == null || list.size() == 0)
			return "3";
		for (int i = 0; i < list.size(); i++) {
			WzGoodsOpenboxResult result = list.get(i);
			Double pass = result.getPassNum()==null ? 0d:result.getPassNum();
			Double exce = (result.getExceNum()==null ? 0l:result.getExceNum()) + 0d;
			Double boxInNum = (result.getBoxinNum()==null ? 0l:result.getBoxinNum()) + 0d;
			if (pass == null || (pass + exce) != boxInNum)
				return "3";
		}
		if (openbox.getIsStorein() == 1)
			return "2";
		Integer i = openbox.getFinished();
		openbox.setFinished((i == null || i == 0) ? 1 : 0);
		this.wzglDAO.saveOrUpdate(openbox);
		return "1";
	}

	@SuppressWarnings("unchecked")
	public String initWzOpenboxResult(String openboxUids) {
		WzGoodsOpenbox openbox = (WzGoodsOpenbox) this.wzglDAO.findById(WzGoodsOpenbox.class.getName(), openboxUids);
		if (openbox == null)
			return "0";

		// boxType 01为部件，02为裸件
		String errMsg = "";
		List<WzGoodsOpenboxSub> listSub01 = this.wzglDAO.findByWhere(
				WzGoodsOpenboxSub.class.getName(), "openboxId='" + openboxUids + "' and boxType='01'");
		List<WzGoodsOpenboxSub> listSub02 = this.wzglDAO.findByWhere(
				WzGoodsOpenboxSub.class.getName(), "openboxId='" + openboxUids + "' and boxType='02'");
		// 检验与开箱通知单对应的部件明细中是否存在“空箱或者裸件未对应设备合同分类树”的情况
		// 检查部件
		for (int i = 0; i < listSub01.size(); i++) {
			WzGoodsOpenboxSub sub = listSub01.get(i);
			String subUids = sub.getUids();
			List<WzGoodsOpenboxSubPart> listPart = this.wzglDAO.findByWhere(WzGoodsOpenboxSubPart.class.getName(), "openboxSubId='" + subUids + "'");
			if (listPart == null || listPart.size() == 0) {
				errMsg += "【" + sub.getBoxNo() + "】" + sub.getBoxName() + "<br>";
			}
		}
		errMsg += "|";
//		for (int i = 0; i < listSub02.size(); i++) {
//			EquGoodsOpenboxSub sub = listSub02.get(i);
//			if (sub.getTreeuids() == null || sub.getTreeuids().equals("")) {
//				errMsg += "【" + sub.getBoxNo() + "】" + sub.getBoxName()
//						+ "<br>";
//			}
//		}
		if (!errMsg.equals("|"))
			return errMsg;

		// 检查完成，开始初始化数据
		// 初始化之前删除已有数据
		List<WzGoodsOpenboxResult> list = this.wzglDAO.findByWhere(
				WzGoodsOpenboxResult.class.getName(), "openboxId='" + openboxUids + "'");
		this.wzglDAO.deleteAll(list);

		// 直接查询出当前开箱检验单下所有部件
		List<WzGoodsOpenboxSubPart> listPart = this.wzglDAO.findByWhere(
				WzGoodsOpenboxSubPart.class.getName(), "openboxId='" + openboxUids + "'");
		for (int j = 0; j < listPart.size(); j++) {
			WzGoodsOpenboxSubPart part = listPart.get(j);
			WzGoodsOpenboxResult result = new WzGoodsOpenboxResult();

			result.setPid(part.getPid());
			result.setOpenboxId(part.getOpenboxId());
			result.setOpenboxNo(part.getOpenboxNo());
			result.setTreeuids(part.getTreeuids());
			result.setEquType(part.getEquType());
			result.setJzNo(part.getJzNo());
			result.setBoxNo(part.getBoxNo());
			result.setEquPartName(part.getEquPartName());
			result.setGgxh(part.getGgxh());
			result.setBoxinNum(part.getBoxinNum());
			result.setUnit(part.getUnit());
			result.setWeight(part.getWeight());
			result.setGraphNo(part.getGraphNo());
			result.setRealNum(part.getBoxinNum());
			this.wzglDAO.saveOrUpdate(result);
		}
		// 所有裸件
		for (int i = 0; i < listSub02.size(); i++) {
			WzGoodsOpenboxSub sub = listSub02.get(i);
			WzGoodsOpenboxResult result = new WzGoodsOpenboxResult();

			result.setPid(sub.getPid());
			result.setOpenboxId(sub.getOpenboxId());
			result.setOpenboxNo(sub.getOpenboxNo());
			result.setTreeuids(sub.getTreeuids());
			result.setEquType(sub.getEquType());
			result.setJzNo(sub.getJzNo());
			result.setBoxNo(sub.getBoxNo());
			result.setEquPartName(sub.getBoxName());
			result.setGgxh(sub.getGgxh());
			result.setBoxinNum(sub.getRealNum());
			result.setUnit(sub.getUnit());
			result.setWeight(sub.getWeight());
			result.setGraphNo(sub.getGraphNo());
			result.setRealNum(sub.getRealNum());
			this.wzglDAO.saveOrUpdate(result);
		}

		return "1";
	}

	public String wzNoticeFinished(String uids) {
		WzGoodsOpenboxNotice notice = (WzGoodsOpenboxNotice) this.wzglDAO.findById(WzGoodsOpenboxNotice.class.getName(), uids);
		if (notice == null)
			return "0";
		if (notice.getIsCheck() == 1) {
			return "2";
		}
		Integer i = notice.getFinished();
		notice.setFinished((i == null || i == 0) ? 1 : 0);
		this.wzglDAO.saveOrUpdate(notice);
		return "1";
	}

	@SuppressWarnings("unchecked")
	public String deleteWzOpenboxNotice(String uids) {
		// 删除从表数据
		List<WzGoodsOpenboxNoticeSub> list = this.wzglDAO.findByWhere(
				WzGoodsOpenboxNoticeSub.class.getName(), "noticeId = '" + uids + "'");
		if (list.size() > 0)
			this.wzglDAO.deleteAll(list);
		// 删除附件数据
		List<SgccAttachList> listFile = this.wzglDAO.findByWhere(
				SgccAttachList.class.getName(), "transaction_Id = '" + uids + "'");
		if (listFile.size() > 0) {
			for (int i = 0; i < listFile.size(); i++) {
				SgccAttachList sgc = listFile.get(i);
				SgccAttachBlob sgb = (SgccAttachBlob) this.wzglDAO.findById(SgccAttachBlob.class.getName(), sgc.getFileLsh());
				this.wzglDAO.delete(sgb);
			}
			this.wzglDAO.deleteAll(listFile);
		}
		WzGoodsOpenboxNotice notice = (WzGoodsOpenboxNotice) this.wzglDAO.findById(WzGoodsOpenboxNotice.class.getName(), uids);
		this.wzglDAO.delete(notice);
		return "1";
	}

	public boolean saveStoreWzInByCon(String appid, String[] ids, String dhNo) {
		// ids传过来的是物资主键，但新增的物资的主键为uuid
		if (ids.length < 1)
			return false;
		try {
			for (int i = 0; i < ids.length; i++) {
				WzGoodsArrivalSub wgav = new WzGoodsArrivalSub();
				ConMat conMat = (ConMat) this.wzglDAO.findById(ConMat.class.getName(), ids[i]);
				if (conMat == null)
					return false;
				wgav.setPid(conMat.getPid());
				wgav.setArrivalId(appid);
				wgav.setBoxNo(conMat.getBm());
				wgav.setBoxName(conMat.getPm());
				wgav.setGgxh(conMat.getGg());
				wgav.setUnit(conMat.getDw());
				wgav.setArrivalNo(dhNo);
				wgav.setBoxType("01");
				wgav.setConmatuids(conMat.getUids());
				this.wzglDAO.insert(wgav);
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	@SuppressWarnings("unchecked")
	public String delWzRkGoodsStorein(String uids, String flag, String pid) {
		List<WzGoodsStorein> delList = this.wzglDAO.findByWhere(WzGoodsStorein.class.getName(), "uids='" + uids + "'");
		List<WzGoodsStoreinSub> list = this.wzglDAO.findByWhere(WzGoodsStoreinSub.class.getName(),
				"sbrk_uids='" + uids + "' and  pid='" + pid + "' order by uids");
		WzGoodsStorein wzGoodsStorein = new WzGoodsStorein();
		WzGoodsStoreinSub wzGoodsStoreinSub = new WzGoodsStoreinSub();
		if (list.size() > 0) {
			for (int i = 0; i < list.size(); i++) {
				wzGoodsStoreinSub = (WzGoodsStoreinSub) list.get(i);
				if ("1".equals(flag)) {
					// List delExceUUid =
					// this.wzglDAO.findByWhere(EquGoodsOpenboxExceView.class.getName(),
					// "uids='"+wzGoodsStoreinSub.getBoxSubId()+"'and pid='"+pid+"'");
					// WzGoodsOpenboxExceView wzGoodsOpenboxExceView =
					// (WzGoodsOpenboxExceView)delExceUUid.get(0);
					// String updataExceIsStoreIn =
					// "update equ_goods_openbox_exce set is_storein='0' where uids='"+wzGoodsOpenboxExceView.getUids()+"'";
					// this.wzglDAO.updateBySQL(updataExceIsStoreIn);
				}
				//修改主体设备里面的物资修改删除权限
				String updateSql = "update wz_goods_bodys set del_or_update='1' where equ_no not in (select stockno from ( " +
							       " select * from wz_goods_storein_estimate_sub t union select * from wz_goods_storein_sub " +
							       " where sbrk_uids in (select uids from wz_goods_storein t where t.judgment_flag='body' where  uids<>'"+
							       wzGoodsStoreinSub.getUids()+"' )) and equ_name='"+wzGoodsStoreinSub.getWarehouseName()+"' and ggxh='"+wzGoodsStoreinSub.getGgxh()+"'";
				this.wzglDAO.updateBySQL(updateSql);				
				this.wzglDAO.delete(wzGoodsStoreinSub);
			}
		}
		wzGoodsStorein = (WzGoodsStorein) delList.get(0);
		if ("0".equals(flag) && wzGoodsStorein.getOpenBoxId() != null) {
			String[] noArr = wzGoodsStorein.getOpenBoxId().split(",");
			for (int i = 0; i < noArr.length; i++) {
				String updataIsStorein = "update wz_goods_openbox set is_storein ='0' where uids='"
						+ noArr[i] + "' and pid='" + pid + "'";
				this.wzglDAO.updateBySQL(updataIsStorein);
			}
		}
		this.wzglDAO.delete(wzGoodsStorein);
		return "success";
	}

	@SuppressWarnings("unchecked")
	public int judgmentWzFinished(String uids, String exceFlag, String pid, String flags, String makeType) {
		List<WzGoodsStoreinSub> list = this.wzglDAO.findByWhere(WzGoodsStoreinSub.class.getName(),
				"sbrk_uids='" + uids + "' and pid='" + pid + "'");
		if (list.size() == 0) {
			return 3;
		} else if (list.size() > 0) {
			int flag = 0;
			for (int i = 0; i < list.size(); i++) {
				WzGoodsStoreinSub wzGoodsStoreinSub = new WzGoodsStoreinSub();
				wzGoodsStoreinSub = (WzGoodsStoreinSub) list.get(i);
				if ("".equals(wzGoodsStoreinSub.getInWarehouseNo())
						|| wzGoodsStoreinSub.getInWarehouseNo() == null
						|| wzGoodsStoreinSub.getInWarehouseNo() == 0) {
					flag = 2;
					break;
				}
/*				else if ("".equals(wzGoodsStoreinSub.getIntoMoney())
						|| wzGoodsStoreinSub.getIntoMoney() == null
						|| wzGoodsStoreinSub.getIntoMoney() == 0) {
					flag = 2;
					break;
				} else if ("".equals(wzGoodsStoreinSub.getTotalMoney())
						|| wzGoodsStoreinSub.getTotalMoney() == null
						|| wzGoodsStoreinSub.getTotalMoney() == 0) {
					flag = 2;
					break;
				} else if ("".equals(wzGoodsStoreinSub.getEquno())
						|| wzGoodsStoreinSub.getEquno() == null
						|| "0".equals(wzGoodsStoreinSub.getEquno())) {
					flag = 2;
					break;
				}*/
			}
			if (flag == 2) {
				return 2;
			} else {
				// 对完结的数据存入设备库存里面去
				String resule = this.finishWzRkGoodsStorein(uids, pid, flags, makeType);
				if ("success".equals(resule)) {
					// 入库成功后，更新完结状态，完结时间，完结操作人
					WzGoodsStorein storein = (WzGoodsStorein) this.wzglDAO.findById(WzGoodsStorein.class.getName(), uids);
					storein.setFinished((byte) 1);
					storein.setFinishedDate(new Date());
					storein.setFinishedUser(this.getCurrentUserid());
					// 完结时自动稽核 pengy 2014-03-06
					storein.setAuditState("1");
					this.wzglDAO.saveOrUpdate(storein);
					return 0;
				} else {
					return 1;
				}
			}
		}
		return 1;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	private String finishWzRkGoodsStorein(String uids, String pid,String flags,String makeType) {
		String whereSql = "";
		List list = this.wzglDAO.findByWhere(WzGoodsStorein.class.getName(), "uids='" + uids + "'");
		WzGoodsStorein wzGoodsStorein = (WzGoodsStorein) list.get(0);
		List getSubList = this.wzglDAO.findByWhere(WzGoodsStoreinSub.class.getName(),
				"sbrk_uids='" + uids + "' and pid='" + pid + "' order by uids");
		for (int i = 0; i < getSubList.size(); i++) {
			WzGoodsStock wzGoodsStock = new WzGoodsStock();
			WzGoodsStoreinSub obj = (WzGoodsStoreinSub) getSubList.get(i);
			if(wzGoodsStorein.getJudgmentFlag().equals("body")){
				//出入库台账统计
				insertCLSubToFinishedRecord(obj.getPid(),obj.getUids(),"","","RK");
				whereSql = "conid='" + wzGoodsStorein.getConid() + "' and pid='" + pid + "' and joinUnit='"
						+ wzGoodsStorein.getJoinUnit() + "' and stockNo = '" + obj.getStockno() + "' and judgmentFlag='body'";
				List<WzGoodsStock> listKC = this.wzglDAO.findByWhere(WzGoodsStock.class.getName(), whereSql);
//		    	入库前的库存数量beforeInNum，金额beforeInMoney，单价beforeInPrice
			    Double beforeInNum = 0d;
			    Double beforeInMoney = 0d;
			    Double beforeInPrice = 0d;
				if (listKC == null||listKC.size()==0) {
					wzGoodsStock.setPid(pid);
					wzGoodsStock.setConid(wzGoodsStorein.getConid());
					wzGoodsStock.setTreeuids(wzGoodsStorein.getTreeUids());
					wzGoodsStock.setBoxNo(obj.getBoxNo());
					wzGoodsStock.setEquType(obj.getWarehouseType());
					wzGoodsStock.setEquPartName(obj.getWarehouseName());
					wzGoodsStock.setGgxh(obj.getGgxh());
					wzGoodsStock.setGraphNo(obj.getGraphNo());
					wzGoodsStock.setUnit(obj.getUnit());
					wzGoodsStock.setWeight(obj.getWeight());
					wzGoodsStock.setStorage(obj.getEquno());
					wzGoodsStock.setStockNum(obj.getInWarehouseNo());
					wzGoodsStock.setStorage(obj.getEquno());
					wzGoodsStock.setJudgmentFlag(flags);
					wzGoodsStock.setMakeType("正式入库");//makeType
					wzGoodsStock.setCreateMan(wzGoodsStorein.getCreateMan());
					wzGoodsStock.setStockNo(obj.getStockno());
					wzGoodsStock.setCreateUnit(wzGoodsStorein.getCreateUnit());
					wzGoodsStock.setIntoMoney(obj.getIntoMoney());
					wzGoodsStock.setKcMoney(obj.getTotalMoney());
					wzGoodsStock.setJoinUnit(wzGoodsStorein.getJoinUnit());
					wzGoodsStock.setSpecial(wzGoodsStorein.getSpecial());
					wzGoodsStock.setJzNo(obj.getJzNo());
					/**
					 * 由于库存中相同材料合并为一条，如果是库存中不存在的材料，则直接取入库金额作为库存金额，
					 * 如果是库存中已存在的设备，则在已有材料的记录上增加入库数量和库存金额，设备类型，规格，单价，单位，仓库号字段覆盖原数据，
					 * 且库存金额已改为库存余额，会随出库而变化，现在已不需要这样计算
					 * pengy 2013-08-08
					 */
//					if(flags.equals("body")){
//						//统计库存金额：库存金额=该物资所有完结入库单的入库金额合计-该物资所有完结出库单的出库金额合计
//						Double  getIntoTotalMoney = 0.00;
//						Double  getOuntTotalMoney = 0.00;
//						String where = "  sbrkUids in (select uids  from WzGoodsStorein  where finished = '0' " +
//								" and judgmentFlag = 'body') and warehouseName='"+obj.getWarehouseName()+"' and warehouseType='"+
//								obj.getWarehouseType()+"' and  stockno='"+obj.getStockno()+"' and ggxh='"+obj.getGgxh()+"'";
//						List<WzGoodsStoreinSub> list1 = this.wzglDAO.findByWhere(WzGoodsStoreinSub.class.getName(), where);
//					    if(list1.size()>0){
//							for(int k=0;k<list1.size();k++){
//								WzGoodsStoreinSub sub = list1.get(k);
//						    	getIntoTotalMoney += sub.getTotalMoney(); 
//						    }
//					    }
//					    String where2 = " outId in (select uids from WzGoodsStockOut where finished = '1'and judgmentFlag = 'body')" +
//					    		"  and equPartName='"+obj.getWarehouseName()+"' and equType='"+obj.getWarehouseType()+"' and boxNo='"+obj.getStockno()+"' and ggxh='"+obj.getGgxh()+"'";
//					    List<WzGoodsStockOutSub> list2 = this.wzglDAO.findByWhere(WzGoodsStockOutSub.class.getName(), where2);
//		 				if(list2.size()>0){
//		 					for(int j=0;j<list2.size();j++){
//		 						WzGoodsStockOutSub outSub = list2.get(j);
//		 						getOuntTotalMoney += outSub.getAmount();
//		 					}
//		 				}
//		 				wzGoodsStock.setKcMoney(getIntoTotalMoney+obj.getTotalMoney()-getOuntTotalMoney);					
//					}
					this.wzglDAO.insert(wzGoodsStock);
				}else{
					wzGoodsStock = listKC.get(0);
					
					beforeInNum = wzGoodsStock.getStockNum() == null ? 0d : wzGoodsStock.getStockNum();
					beforeInPrice = wzGoodsStock.getIntoMoney() == null ? 0d : wzGoodsStock.getIntoMoney();
				    beforeInMoney = wzGoodsStock.getKcMoney() == null ? 0d : wzGoodsStock.getKcMoney();
					
					wzGoodsStock.setEquType(obj.getWarehouseType());
					wzGoodsStock.setEquPartName(obj.getWarehouseName());
					wzGoodsStock.setGgxh(obj.getGgxh());
					wzGoodsStock.setUnit(obj.getUnit());
					wzGoodsStock.setIntoMoney(beforeInPrice);
					wzGoodsStock.setStockNum(beforeInNum + obj.getInWarehouseNo());
					wzGoodsStock.setKcMoney(beforeInMoney + obj.getTotalMoney());
					wzGoodsStock.setStorage(obj.getEquno());
					wzGoodsStock.setSpecial(wzGoodsStorein.getSpecial());
					wzGoodsStock.setJzNo(obj.getJzNo());
					this.wzglDAO.saveOrUpdate(wzGoodsStock);
				}
				
				//主体材料入库成功后，同时将明细插入物资台帐EQU_GOODS_TZ pengy 2014-08-06
				insertEquGoodsTz(makeType, wzGoodsStorein, obj);
			}else{
				whereSql = "conid='" + wzGoodsStorein.getConid()
						+ "' and treeuids='" + wzGoodsStorein.getTreeUids()
						+ "' and equPartName='" + obj.getWarehouseName()
						+ "' and pid='" + pid + "' and makeType='"+makeType+"'"
						+ " and judgmentFlag='noBody'";
				if(obj.getGraphNo() == null || obj.getGraphNo().equals("")){
					whereSql += " and graphNo is null";
				}else{
					whereSql += " and graphNo='"+obj.getGraphNo()+"'";
				}
				if(obj.getBoxNo() == null || obj.getBoxNo().equals("")){
					whereSql += " and boxNo is null";
				}else{
					whereSql += " and boxNo='"+obj.getBoxNo()+"'";
				}
				
				if(obj.getUnit() == null || obj.getUnit().equals("")){
					whereSql += " and unit is null";
				}else{
					whereSql += " and unit='"+obj.getUnit()+"'";
				}
				List listKC = this.wzglDAO.findByWhere(
						WzGoodsStock.class.getName(), whereSql);
				if (listKC.size() == 0) {
					wzGoodsStock.setPid(pid);
					wzGoodsStock.setConid(wzGoodsStorein.getConid());
					wzGoodsStock.setTreeuids(wzGoodsStorein.getTreeUids());
					wzGoodsStock.setBoxNo(obj.getBoxNo());
					wzGoodsStock.setEquType(obj.getWarehouseType());
					wzGoodsStock.setEquPartName(obj.getWarehouseName());
					wzGoodsStock.setGgxh(obj.getGgxh());
					wzGoodsStock.setGraphNo(obj.getGraphNo());
					wzGoodsStock.setUnit(obj.getUnit());
					wzGoodsStock.setWeight(obj.getWeight());
					wzGoodsStock.setStorage(obj.getEquno());
					wzGoodsStock.setStockNum(obj.getInWarehouseNo());
					wzGoodsStock.setStorage(obj.getEquno());
					wzGoodsStock.setJudgmentFlag(flags);
					wzGoodsStock.setMakeType(makeType);
					wzGoodsStock.setCreateMan(wzGoodsStorein.getCreateMan());
					wzGoodsStock.setCreateUnit(wzGoodsStorein.getCreateUnit());
					wzGoodsStock.setStockNo(obj.getStockno());
					this.wzglDAO.insert(wzGoodsStock);
				} else {
					wzGoodsStock = (WzGoodsStock) listKC.get(0);
					wzGoodsStock.setStockNum((wzGoodsStock.getStockNum() == null?0d:wzGoodsStock.getStockNum())
								+ (obj.getInWarehouseNo() == null?0d:obj.getInWarehouseNo()));
					this.wzglDAO.saveOrUpdate(wzGoodsStock);
				}
			}
		}
		return "success";
	}

	public String saveOrUpdataWzRkGoodsStorein(WzGoodsStorein wzGoodsStorein, String pid, String uids) {
		String warehouseNo = wzGoodsStorein.getWarehouseNo();
		String conid = wzGoodsStorein.getConid();
		uids = wzGoodsStorein.getUids();
		if ("".equals(uids)) {
			String whereSql = " pid='" + pid + "' and warehouseNo='"
					+ warehouseNo + "' and conid='" + conid + "' and judgmentFlag='"+wzGoodsStorein.getJudgmentFlag()+"'";
			List list = this.wzglDAO.findByWhere(WzGoodsStorein.class.getName(), whereSql);
			if (list.size() > 0) {
				return "repeat";
			} else {
				ConOve conOve = (ConOve) this.wzglDAO.findById(ConOve.class.getName(), wzGoodsStorein.getConid());
				wzGoodsStorein.setSupplyunit(conOve.getPartybno());

				this.wzglDAO.insert(wzGoodsStorein);
				return "success";
			}
		} else if (!"".equals(uids)) {
			this.wzglDAO.saveOrUpdate(wzGoodsStorein);
			return "success";
		}
		return "failure";
	}

	@SuppressWarnings("unchecked")
	public String selectWzCheckToEquIn(String[] uidsArr, String getUids) {
		WzGoodsStorein storein = (WzGoodsStorein) this.wzglDAO.findById(WzGoodsStorein.class.getName(), getUids);
		String pid = storein.getPid();
		String openBoxNo = "";
		String openUids = "";
		for (int j = 0; j < uidsArr.length; j++) {
			// 处理存货编码
			List<EquWarehouse> listWare = this.wzglDAO.findByWhere(
					EquWarehouse.class.getName(), "equid = '" + storein.getEquid() + "'");
			EquWarehouse warehouse = new EquWarehouse();
			if (listWare.size() > 0) {
				warehouse = listWare.get(0);
			}
			String prefix = warehouse.getWaretypecode() + "-" + warehouse.getWarenocode() + "-";
			String stockno = "";

			String sql = "select trim(to_char(nvl(max(substr(stockno,length('"
					+ prefix + "') +1, 4)),0) +1,'0000')) "
					+ " from Wz_Goods_Storein_Sub where pid = '" + pid + "' "
					+ " and  substr(stockno,1,length('" + prefix + "')) ='"
					+ prefix + "'";
			List<String> listStr = this.wzglDAO.getDataAutoCloseSes(sql);
			if (listStr != null) {
				stockno = listStr.get(0);
			}

			// SetListEquRkGoodsStorein方法内容
			String uids = uidsArr[j];
			// 选择的开箱检验单
			WzGoodsOpenbox openbox = (WzGoodsOpenbox) this.wzglDAO.findById(WzGoodsOpenbox.class.getName(), uids);

			String shereSql = " openbox_id='" + uids + "' and pid='" + pid
					+ "' order by uids";
			List<WzGoodsOpenboxResult> list = this.wzglDAO.findByWhere(WzGoodsOpenboxResult.class.getName(), shereSql);
			for (int i = 0; i < list.size(); i++) {
				WzGoodsOpenboxResult obj = list.get(i);
				WzGoodsStoreinSub wzGoodsStoreinSub = new WzGoodsStoreinSub();
				wzGoodsStoreinSub.setStockno(prefix + stockno);// 存货编码
				wzGoodsStoreinSub.setPid(pid);
				wzGoodsStoreinSub.setSbrkUids(getUids);
				wzGoodsStoreinSub.setBoxSubId(obj.getUids());
				wzGoodsStoreinSub.setBoxNo(obj.getBoxNo());
				wzGoodsStoreinSub.setWarehouseName(obj.getEquPartName());
				wzGoodsStoreinSub.setWarehouseType(obj.getEquType());
				wzGoodsStoreinSub.setGgxh(obj.getGgxh());
				wzGoodsStoreinSub.setWeight( obj.getWeight() == null?0d:(Double.valueOf(obj.getWeight().toString())));
				wzGoodsStoreinSub.setGraphNo(obj.getGraphNo());
				wzGoodsStoreinSub.setUnit(obj.getUnit());
				wzGoodsStoreinSub.setWarehouseNum(obj.getPassNum());
				wzGoodsStoreinSub.setInWarehouseNo(obj.getPassNum());
				this.wzglDAO.insert(wzGoodsStoreinSub);

				Integer n = Integer.parseInt(stockno);
				stockno = String.format("%04d", n + 1);

			}
			openBoxNo += "," + openbox.getOpenNo();
			openUids += "," + openbox.getUids();
			// 更新开箱检验单的已入库状态
			String updataIsStorein = "update wz_goods_openbox set is_storein='1' where uids='"
					+ uids + "' and pid='" + pid + "'";
			this.wzglDAO.updateBySQL(updataIsStorein);
		}
		openBoxNo = openBoxNo.substring(1);
		openUids = openUids.substring(1);

		String updataSql = "update wz_goods_storein t set t.notice_no = '"
				+ openBoxNo + "',t.abnormal_or_no = '0'" + ",t.open_box_id ='"
				+ openUids + "' where t.uids='" + getUids + "' and t.pid='" + pid + "'";
		this.wzglDAO.updateBySQL(updataSql);

		return "";
	}

	public Double getWzStockNumFromStock(String id) {
		WzGoodsStock stock = (WzGoodsStock) this.wzglDAO.findById(WzGoodsStock.class.getName(), id);
		if (stock != null) {
			return stock.getStockNum();
		}
		return new Double(0);
	}

	@SuppressWarnings("unchecked")
	public String addOrUpdateWzOut(WzGoodsStockOut equOut) {
		String uids = equOut.getUids();
		if (uids == null || uids.equals("")) {
			this.wzglDAO.insert(equOut);
			return equOut.getUids();
		} else {
			this.wzglDAO.saveOrUpdate(equOut);
			if(equOut.getJudgmentFlag().equals("body")){
				//yanglh 2013-6-8
				//处理选择领料用途后修改从主体设备选择的出库单明细
				String whereSub = " outId = '" + uids + "'";
				List<WzGoodsStockOutSub>  equSubList = this.wzglDAO.findByWhere(WzGoodsStockOutSub.class.getName(), whereSub);
				for(int j = 0; j <equSubList.size(); j++){
					WzGoodsStockOutSub equSub = equSubList.get(j);
		 			 String updateSql = "UPDATE WzGoodsBodys set estimateNo='"+equOut.getUsing()+"' " +
					 		" where equNo='"+equSub.getBoxNo()+"' and equName='"+equSub.getEquPartName()+"'";// and conid='"+equOut.getConid()+"'";
		 			 this.wzglDAO.executeHQL(updateSql);
				}
				return equOut.getUids();
			}else{
				String where = " outId = '" + uids + "'";
				List<WzGoodsStockOutSub> list = this.wzglDAO.findByWhere(WzGoodsStockOutSub.class.getName(), where);
	
				// 处理存货编码
				// EquGoodsStockOut out = (EquGoodsStockOut)
				// this.equipmentDAO.findById(EquGoodsStockOut.class.getName(), uids);
				List<EquWarehouse> listWare = this.wzglDAO.findByWhere(
						EquWarehouse.class.getName(), "equid = '" + equOut.getEquid() + "'");
				EquWarehouse warehouse = new EquWarehouse();
				if (listWare.size() > 0) {
					warehouse = listWare.get(0);
				}
				String prefix = warehouse.getWaretypecode() + "-" + warehouse.getWarenocode() + "-";
				String stockno = "";
	
				String sql = "select trim(to_char(nvl(max(substr(box_no,length('" + prefix
						+ "') +1, 4)),0) +1,'0000')) from wz_goods_stock_out_sub where 1=1 and substr(box_no,1,length('"
						+ prefix + "')) ='" + prefix + "'";
				List<String> listStr = this.wzglDAO.getDataAutoCloseSes(sql);
				if (listStr != null) {
					stockno = listStr.get(0);
				}

				for (int i = 0; i < list.size(); i++) {
					WzGoodsStockOutSub outSub = list.get(i);
					if (outSub != null) {
						outSub.setBoxNo(prefix + stockno);// 存货编码
						this.wzglDAO.saveOrUpdate(outSub);
	
						Integer n = Integer.parseInt(stockno);
						stockno = String.format("%04d", n + 1);
					}
				}
				return equOut.getUids();
			}
		}
	}

	public String insertWzOutSubFromStock(String[] uids, String id, String no) {
		for (int i = 0; i < uids.length; i++) {
			WzGoodsStock stock = (WzGoodsStock) this.wzglDAO.findById(WzGoodsStock.class.getName(), uids[i]);

			if (stock != null) {
				WzGoodsStockOutSub outSub = new WzGoodsStockOutSub();
				outSub.setOutId(id);
				outSub.setOutNo(no);
				outSub.setPid(stock.getPid());
				outSub.setBoxNo(stock.getBoxNo());
				outSub.setEquType(stock.getEquType());
				outSub.setEquPartName(stock.getEquPartName());
				outSub.setGgxh(stock.getGgxh());
				outSub.setGraphNo(stock.getGraphNo());
				outSub.setOutNum(0D);
				outSub.setStorage(stock.getStorage());
				outSub.setUnit(stock.getUnit());
				outSub.setStockId(stock.getUids());
				outSub.setBoxNo(stock.getStockNo());
				outSub.setPrice(stock.getIntoMoney());
				outSub.setKcMoney(stock.getKcMoney());
				this.wzglDAO.saveOrUpdate(outSub);
			}
		}
		return "1";
	}

	@SuppressWarnings("unchecked")
	public String deleteWzOutAndOutSub(String uids) {
		if (uids != null && !"".equals(uids)) {
			WzGoodsStockOut out = (WzGoodsStockOut) this.wzglDAO.findById(WzGoodsStockOut.class.getName(), uids);
			if (out != null) {
				List<WzGoodsStockOutSub> uousub = this.wzglDAO.findByWhere(WzGoodsStockOutSub.class.getName(),
						"outId='" + uids + "'");
				if (uousub.size() > 0) {
					String updateSql = "merge into wz_goods_stock e using (select s.stock_id,s.out_Num from" +
							" wz_goods_stock_out_sub s where s.out_id='" + uids
							+ "' and s.out_Num <> 0) o on(e.uids=o.stock_Id) when matched "
							+ "then update set e.stock_Num=e.stock_Num+o.out_Num ";
					String deleteSql = "delete from wz_goods_stock_out_sub s where s.out_id='" + uids + "'";
					JdbcUtil.update(updateSql);
					JdbcUtil.execute(deleteSql);
				}
				List<SgccAttachList> list = this.wzglDAO.findByWhere(
						SgccAttachList.class.getName(), "transaction_id='" + uids + "'");
				if (list.size() > 0) {
					for (int i = 0; i < list.size(); i++) {
						SgccAttachList sal = list.get(i);
						List<SgccAttachBlob> delList = this.wzglDAO.findByWhere(SgccAttachBlob.class.getName(), "file_lsh='" + sal.getFileLsh() + "'");
						this.wzglDAO.deleteAll(delList);
					}
				}
				this.wzglDAO.delete(out);
				return "0";
			}
		}
		return "1";
	}

	/**
	 * 出库单完结操作
	 * @param uids
	 * @return 1：完结操作成功，2：已安装，不能完结操作。
	 */
	@SuppressWarnings("unchecked")
	public String wzOutFinished(String uids) {
		WzGoodsStockOut out = (WzGoodsStockOut) this.wzglDAO.findById(WzGoodsStockOut.class.getName(), uids);
		if (out == null)
			return "0";
		if (out.getIsInstallation() == 1) {
			return "2";
		}
		Integer i = out.getFinished();
		out.setFinished((i == null || i == 0) ? 1 : 0);
		out.setFinishedDate(new Date());
		out.setFinishedUser(this.getCurrentUserid());
		//完结时自动稽核 pengy 2014-03-06
		out.setAuditState("1");
		this.wzglDAO.saveOrUpdate(out);
		
		if(out.getJudgmentFlag().equals("body")){
			List<WzGoodsStockOutSub> listSub = this.wzglDAO.findByWhere(WzGoodsStockOutSub.class.getName(), "outId = '" + uids + "'");
			if(listSub.size()==0){
				return "3";
			}
			for (int j = 0; j < listSub.size(); j++) {
				//主体材料出库成功后，同时将明细插入物资台帐EQU_GOODS_TZ pengy 2014-08-06
				insertEquGoodsTz(out.getType(), out, listSub.get(j));
			}
		}
		return "1";
	}

	/**
	 * 获取设备出库数量
	 */
	public Double getWzOutNumFromOutSub(String id) {
		WzGoodsStockOutSub sub = (WzGoodsStockOutSub) this.wzglDAO.findById(WzGoodsStockOutSub.class.getName(), id);
		if (sub != null) {
			return sub.getOutNum();
		}
		return 0D;
	}

	public int updateWzStockNum(Double newstocknum, String id) {
		String updateSql = "update wz_goods_stock e set e.stock_Num="
				+ newstocknum + " where uids='" + id + "'";
		int result = JdbcUtil.update(updateSql);
		return result;
	}

	/**
	 * 材料暂估入库新增时保存到主表的记录
	 * @param equGoodsZGRKStorein
	 * @param pid
	 * @param uids
	 * @return
	 */
	public String saveOrUpdataWzZGRkGoodsStorein(WzGoodsStoreinEstimate wzGoodsZGRKStorein, String pid, String uids) {
		String warehouseNo = wzGoodsZGRKStorein.getWarehouseNo();
		String conid = wzGoodsZGRKStorein.getConid();
		uids = wzGoodsZGRKStorein.getUids();
		if ("".equals(uids)) {
			String whereSql = " pid='" + pid + "' and warehouseNo='" + warehouseNo + "' and conid='" + conid + "'";
			List list = this.wzglDAO.findByWhere(WzGoodsStoreinEstimate.class.getName(), whereSql);
			if (list.size() > 0) {
				return "repeat";
			} else {
				ConOve conOve = (ConOve) this.wzglDAO.findById(ConOve.class.getName(), wzGoodsZGRKStorein.getConid());
				wzGoodsZGRKStorein.setSupplyunit(conOve.getPartybno());

				this.wzglDAO.insert(wzGoodsZGRKStorein);
				return "success";
			}
		} else if (!"".equals(uids)) {
			this.wzglDAO.saveOrUpdate(wzGoodsZGRKStorein);
			return "success";
		}
		return "failure";
	}

	/**
	 * 从材料开箱单中选择
	 * @param uidsArr
	 * @param getUids
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String selectWzCheckToEquInEstimate(String[] uidsArr, String getUids) {
		WzGoodsStoreinEstimate storein = (WzGoodsStoreinEstimate) this.wzglDAO.findById(WzGoodsStoreinEstimate.class.getName(), getUids);
		String pid = storein.getPid();
		String openBoxNo = "";
		String openUids = "";
		for (int j = 0; j < uidsArr.length; j++) {
			// 处理存货编码
			List<EquWarehouse> listWare = this.wzglDAO.findByWhere(EquWarehouse.class.getName(),
					"equid='" + storein.getEquid() + "'");
			EquWarehouse warehouse = new EquWarehouse();
			if (listWare.size() > 0) {
				warehouse = listWare.get(0);
			}
			String prefix = warehouse.getWaretypecode() + "-" + warehouse.getWarenocode() + "-";
			// List<EquGoodsStoreinSub> listSub =
			// this.equipmentDAO.findByWhere(EquGoodsStoreinSub.class.getName(),
			// " stockno like '"+stockno+"%'");
			String stockno = "";

			String sql = "select trim(to_char(nvl(max(substr(stockno,length('"
					+ prefix + "') +1, 4)),0) +1,'0000')) "
					+ " from wz_goods_storein_estimate_sub where pid = '" + pid
					+ "' and  substr(stockno,1,length('" + prefix
					+ "')) ='" + prefix + "'";
			List<String> listStr = this.wzglDAO.getDataAutoCloseSes(sql);
			if (listStr != null) {
				stockno = listStr.get(0);
			}

			// SetListEquRkGoodsStorein方法内容
			String uids = uidsArr[j];
			// 选择的开箱检验单
			WzGoodsOpenbox openbox = (WzGoodsOpenbox) this.wzglDAO.findById(WzGoodsOpenbox.class.getName(), uids);

			String shereSql = " openbox_id='" + uids + "' and pid='" + pid + "' order by uids";
			List<WzGoodsOpenboxResult> list = this.wzglDAO.findByWhere(WzGoodsOpenboxResult.class.getName(), shereSql);
			for (int i = 0; i < list.size(); i++) {
				WzGoodsOpenboxResult obj = list.get(i);
				WzGoodsStoreinEstimateSub egses = new WzGoodsStoreinEstimateSub();
				egses.setStockno(prefix + stockno);// 存货编码
				egses.setPid(pid);
				egses.setSbrkUids(getUids);
				egses.setBoxSubId(obj.getUids());
				egses.setBoxNo(obj.getBoxNo());
				egses.setWarehouseName(obj.getEquPartName());
				egses.setWarehouseType(obj.getEquType());
				egses.setGgxh(obj.getGgxh());
				egses.setWeight(Double.valueOf(obj.getWeight()));
				egses.setGraphNo(obj.getGraphNo());
				egses.setUnit(obj.getUnit());
				egses.setWarehouseNum(obj.getPassNum());
				egses.setInWarehouseNo(obj.getPassNum());
				this.wzglDAO.insert(egses);

				Integer n = Integer.parseInt(stockno);
				stockno = String.format("%04d", n + 1);

			}
			openBoxNo += "," + openbox.getOpenNo();
			openUids += "," + openbox.getUids();
			// 更新开箱检验单的已入库状态
			String updataIsStorein = "update wz_goods_openbox set is_storein='1' where uids='"
					+ uids + "' and pid='" + pid + "'";
			this.wzglDAO.updateBySQL(updataIsStorein);
		}
		openBoxNo = openBoxNo.substring(1);
		openUids = openUids.substring(1);

		String updataSql = "update wz_goods_storein_estimate t set t.notice_no = '" + openBoxNo
				+ "',t.abnormal_or_no = '0'" + ",t.open_box_id ='" + openUids
				+ "' where t.uids='" + getUids + "' and t.pid='" + pid + "'";
		this.wzglDAO.updateBySQL(updataSql);

		return "";
	}

	/**
	 * 删除暂估入库的记录
	 * @param uids
	 * @param flag
	 * @param pid
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String delWzRkGoodsStoreinEstimate(String uids, String flag, String pid) {
		List<WzGoodsStoreinEstimate> delList = this.wzglDAO.findByWhere(WzGoodsStoreinEstimate.class.getName(), "uids='" + uids + "'");
		List<WzGoodsStoreinEstimateSub> list = this.wzglDAO.findByWhere(WzGoodsStoreinEstimateSub.class.getName(),
				"sbrk_uids='" + uids + "' and  pid='" + pid + "' order by uids");
		WzGoodsStoreinEstimate equGoodsStorein = new WzGoodsStoreinEstimate();
		WzGoodsStoreinEstimateSub equGoodsStoreinSub = new WzGoodsStoreinEstimateSub();
		if (list.size() > 0) {
			for (int i = 0; i < list.size(); i++) {
				equGoodsStoreinSub = (WzGoodsStoreinEstimateSub) list.get(i);
				// if("1".equals(flag)){
				// List delExceUUid =
				// this.wzglDAO.findByWhere(EquGoodsOpenboxExceView.class.getName(),
				// "uids='"+equGoodsStoreinSub.getBoxSubId()+"'and pid='"+pid+"'");
				// EquGoodsOpenboxExceView equGoodsOpenboxExceView =
				// (EquGoodsOpenboxExceView)delExceUUid.get(0);
				// String updataExceIsStoreIn =
				// "update equ_goods_openbox_exce set is_storein='0' where uids='"+equGoodsOpenboxExceView.getUids()+"'";
				// this.wzglDAO.updateBySQL(updataExceIsStoreIn);
				// }
				//修改主体设备里面的物资修改删除权限
				String updateSql = "update wz_goods_bodys set del_or_update='1' where equ_no not in (select stockno from ( " +
							       " select * from wz_goods_storein_sub  where sbrk_uids in (select uids from wz_goods_storein t" +
							       " where t.judgment_flag='body' )  union select * from wz_goods_storein_estimate_sub where " +
							       " uids<>'"+equGoodsStoreinSub.getUids()+"' )) and equ_name='"+equGoodsStoreinSub.getWarehouseName()+
							       "' and ggxh='"+equGoodsStoreinSub.getGgxh()+"'";
				this.wzglDAO.updateBySQL(updateSql);
				this.wzglDAO.delete(equGoodsStoreinSub);
			}
		}
		if (delList.size() > 0) {
			List<SgccAttachList> listSAL = this.wzglDAO.findByWhere(
					SgccAttachList.class.getName(), "transaction_id ='" + uids + "'");
			if (listSAL.size() > 0) {
				for (int i = 0; i < listSAL.size(); i++) {
					SgccAttachList sal = listSAL.get(i);
					SgccAttachBlob sab = (SgccAttachBlob) this.wzglDAO.findById(SgccAttachBlob.class.getName(), sal.getFileLsh());
					this.wzglDAO.delete(sab);
					this.wzglDAO.delete(sal);
				}
			}
		}
		equGoodsStorein = (WzGoodsStoreinEstimate) delList.get(0);
		if ("0".equals(flag) && equGoodsStorein.getOpenBoxId() != null) {
			String[] noArr = equGoodsStorein.getOpenBoxId().split(",");
			for (int i = 0; i < noArr.length; i++) {
				String updataIsStorein = "update wz_goods_openbox set is_storein ='0' where uids='"
						+ noArr[i] + "' and pid='" + pid + "'";
				this.wzglDAO.updateBySQL(updataIsStorein);
			}
		}
		this.wzglDAO.delete(equGoodsStorein);
		return "success";
	}

	public int judgmentWzFinishedEstimate(String uids, String exceFlag, String pid,String flags,String makeType) {
		String updateSql = "";
		List list = this.wzglDAO.findByWhere(WzGoodsStoreinEstimateSub.class.getName(),
				"sbrk_uids='" + uids + "' and pid='" + pid + "'");
		if (list.size() == 0) {
			return 3;
		} else if (list.size() > 0) {
			int flag = 0;
			for (int i = 0; i < list.size(); i++) {
				WzGoodsStoreinEstimateSub equGoodsStoreinSub = new WzGoodsStoreinEstimateSub();
				equGoodsStoreinSub = (WzGoodsStoreinEstimateSub) list.get(i);

				if ("".equals(equGoodsStoreinSub.getInWarehouseNo())
						|| equGoodsStoreinSub.getInWarehouseNo() == null
						|| equGoodsStoreinSub.getInWarehouseNo() == 0) {
					flag = 2;
					break;
				}
/*				else if ("".equals(equGoodsStoreinSub.getIntoMoney())
						|| equGoodsStoreinSub.getIntoMoney() == null
						|| equGoodsStoreinSub.getIntoMoney() == 0) {
					flag = 2;
					break;
				} else if ("".equals(equGoodsStoreinSub.getTotalMoney())
						|| equGoodsStoreinSub.getTotalMoney() == null
						|| equGoodsStoreinSub.getTotalMoney() == 0) {
					flag = 2;
					break;
				}*/
			}
			if (flag == 2) {
				return 2;
			} else {
				// 对完结的数据存入设备库存里面去
				String resule = this.finishWzZGRkGoodsStorein(uids, pid,flags,makeType);
				if ("success".equals(resule)) {
					updateSql = " update wz_goods_storein_estimate t set t.finished='0' where t.uids='"
							+ uids + "' and t.pid='" + pid + "'";
					JdbcUtil.execute(updateSql);
					return 0;
				} else {
					return 1;
				}
			}
		}
		return 1;
	}

	@SuppressWarnings("unchecked")
	public String finishWzZGRkGoodsStorein(String uids, String pid,String flags,String makeType) {
		List<WzGoodsStoreinEstimate> list = this.wzglDAO.findByWhere(WzGoodsStoreinEstimate.class.getName(), "uids='" + uids + "'");
		WzGoodsStoreinEstimate equGoodsStorein = (WzGoodsStoreinEstimate) list.get(0);
		List<WzGoodsStoreinEstimateSub> getSubList = this.wzglDAO.findByWhere(WzGoodsStoreinEstimateSub.class.getName(),
				"sbrk_uids='" + uids + "' and pid='" + pid + "' order by uids");
		for (int i = 0; i < getSubList.size(); i++) {
			WzGoodsStock equGoodsStock = new WzGoodsStock();
			WzGoodsStoreinEstimateSub obj = (WzGoodsStoreinEstimateSub) getSubList.get(i);
//			whereSql = "conid='" + equGoodsStorein.getConid()
//					+ "' and treeuids='" + equGoodsStorein.getTreeUids()
//					+ "' and box_no='" + obj.getBoxNo()
//					+ "' and equ_part_name='" + obj.getWarehouseName()
//					+ "' and pid='" + pid + "' and makeType='"+makeType+"'";
//			List listKC = this.wzglDAO.findByWhere(
//					WzGoodsStock.class.getName(), whereSql);
//			if (listKC.size() == 0) {
				equGoodsStock.setPid(pid);
				equGoodsStock.setConid(equGoodsStorein.getConid());
				equGoodsStock.setTreeuids(equGoodsStorein.getTreeUids());
				equGoodsStock.setBoxNo(obj.getBoxNo());
				equGoodsStock.setEquType(obj.getWarehouseType());
				equGoodsStock.setEquPartName(obj.getWarehouseName());
				equGoodsStock.setGgxh(obj.getGgxh());
				equGoodsStock.setGraphNo(obj.getGraphNo());
				equGoodsStock.setUnit(obj.getUnit());
				equGoodsStock.setWeight(obj.getWeight());
				equGoodsStock.setStorage(obj.getEquno());
				equGoodsStock.setStockNum(obj.getInWarehouseNo());
				equGoodsStock.setStorage(obj.getEquno());
				equGoodsStock.setJudgmentFlag(flags);
				equGoodsStock.setMakeType(makeType);
				equGoodsStock.setStockNo(obj.getStockno());
				equGoodsStock.setIntoMoney(obj.getIntoMoney());
				//统计库存金额：库存金额=该物资所有完结入库单的入库金额合计-该物资所有完结出库单的出库金额合计
				Double  getIntoTotalMoney = 0.00;
				Double  getOuntTotalMoney = 0.00;
				String where = "  sbrkUids in (select uids  from WzGoodsStoreinEstimate  where finished = '0' " +
						" and judgmentFlag = 'body') and warehouseName='"+obj.getWarehouseName()+"' and warehouseType='"+
						obj.getWarehouseType()+"' and  stockno='"+obj.getStockno()+"' and ggxh='"+obj.getGgxh()+"'";
				List<WzGoodsStoreinEstimateSub> list1 = this.wzglDAO.findByWhere(WzGoodsStoreinEstimateSub.class.getName(), where);
			    if(list1.size()>0){
					for(int k=0;k<list1.size();k++){
						WzGoodsStoreinEstimateSub sub = list1.get(k);
				    	getIntoTotalMoney += sub.getTotalMoney(); 
				    }
			    }
			    String where2 = " outId in (select uids from WzGoodsOutEstimate where finished = '1'and judgmentFlag = 'body')" +
			    		"  and equPartName='"+obj.getWarehouseName()+"' and equType='"+obj.getWarehouseType()+"' and boxNo='"+obj.getStockno()+"' and ggxh='"+obj.getGgxh()+"'";
			    List<WzGoodsOutEstimateSub> list2 = this.wzglDAO.findByWhere(WzGoodsOutEstimateSub.class.getName(), where2);
 				if(list2.size()>0){
 					for(int j=0;j<list2.size();j++){
 						WzGoodsOutEstimateSub outSub = list2.get(j);
 						getOuntTotalMoney += outSub.getAmount();
 					}
 				}
 				equGoodsStock.setKcMoney(getIntoTotalMoney+obj.getTotalMoney()-getOuntTotalMoney);
				this.wzglDAO.insert(equGoodsStock);
//			} else {
//				equGoodsStock = (WzGoodsStock) listKC.get(0);
//				equGoodsStock.setStockNum(equGoodsStock.getStockNum()
//						+ obj.getInWarehouseNo());
//				this.wzglDAO.saveOrUpdate(equGoodsStock);
//			}
		}
		return "success";
	}

	/**
	 * 材料冲回入库从暂估入库中选择后存入冲回入库
	 * @param uids
	 * @param newNo
	 * @return
	 */
	public String resetMaterialGoodsStoreinBack(String uids, String newNo) {
		WzGoodsStoreinEstimate egses = (WzGoodsStoreinEstimate) this.wzglDAO.findById(WzGoodsStoreinEstimate.class.getName(), uids);
		if (!egses.equals("")) {
			Date date = new Date();
			WzGoodsStoreinBack egsb = new WzGoodsStoreinBack();
			egsb.setPid(egses.getPid());
			egsb.setConid(egses.getConid());
			egsb.setFinished(Byte.valueOf("1"));
			egsb.setTreeUids(egses.getTreeUids());
			egsb.setWarehouseNo(egses.getWarehouseNo());
			egsb.setWarehouseNoNo(newNo);
			egsb.setWarehouseDate(date);
			egsb.setNoticeNo(egses.getNoticeNo());
			egsb.setWarehouseMan(egses.getWarehouseMan());
			egsb.setMakeMan(egses.getMakeMan());
			egsb.setAbnormalOrNo(egses.getAbnormalOrNo());
			egsb.setOpenBoxId(egses.getOpenBoxId());
			egsb.setSupplyunit(egses.getSupplyunit());
			egsb.setInvoiceno(egses.getInvoiceno());
			egsb.setFileid(egses.getFileid());
			egsb.setEquid(egses.getEquid());
			egsb.setRemark(egses.getRemark());
			egsb.setJudgmentFlag(egses.getJudgmentFlag());
			egsb.setWarehouseInType("冲回入库");
			this.wzglDAO.insert(egsb);
			List<WzGoodsStoreinEstimateSub> list = this.wzglDAO.findByWhere(
					WzGoodsStoreinEstimateSub.class.getName(), "sbrk_uids='" + uids + "'");
			if (list.size() > 0) {
				for (int i = 0; i < list.size(); i++) {
					WzGoodsStoreinEstimateSub egss = list.get(i);
					WzGoodsStoreinBackSub egsbs = new WzGoodsStoreinBackSub();
					egsbs.setSbrkUids(egsb.getUids());
					egsbs.setGgxh(egss.getGgxh());
					egsbs.setMemo(egss.getMemo());
					egsbs.setPid(egss.getPid());
					egsbs.setBoxNo(egss.getBoxNo());
					egsbs.setWarehouseType(egss.getWarehouseType());
					egsbs.setWarehouseName(egss.getWarehouseName());
					egsbs.setGraphNo(egss.getGgxh());
					egsbs.setUnit(egss.getUnit());
					egsbs.setWarehouseNum(egss.getWarehouseNum());
					egsbs.setInWarehouseNo(-egss.getInWarehouseNo());
					egsbs.setIntoMoney(egss.getIntoMoney());
					egsbs.setTotalMoney(-egss.getTotalMoney());
					egsbs.setEquno(egss.getEquno());
					egsbs.setBoxSubId(egss.getBoxSubId());
					egsbs.setWeight(egss.getWeight());
					egsbs.setStockno(egss.getStockno());
					egsbs.setTaxes(-egss.getTaxes());
					egsbs.setTotalnum(-egss.getTotalnum());
					egsbs.setUnitPrice(egss.getUnitPrice());
					egsbs.setAmountMoney(egss.getAmountMoney());
					egsbs.setFreightMoney(egss.getFreightMoney());
					egsbs.setInsuranceMoney(egss.getInsuranceMoney());
					egsbs.setAntherMoney(egss.getAntherMoney());
					egsbs.setAmountTax(egss.getAmountTax());
					egsbs.setFreightTax(egss.getFreightTax());
					egsbs.setInsuranceTax(egss.getInsuranceTax());
					egsbs.setAntherTax(egss.getAntherTax());
					this.wzglDAO.insert(egsbs);
				}
			}
			return "success";
		}
		return null;
	}

	/**
	 * 删除冲回入库数据
	 * @param uids
	 * @param flag
	 * @param pid
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String delWzRkGoodsStoreinBack(String uids, String flag, String pid) {
		List<WzGoodsStoreinBack> list = this.wzglDAO.findByWhere(WzGoodsStoreinBack.class.getName(), "uids='" + uids + "'");
		if (list.size() > 0) {
			List<WzGoodsStoreinBackSub> list1 = this.wzglDAO.findByWhere(
					WzGoodsStoreinBackSub.class.getName(), "sbrk_uids='" + uids + "'");
			if (list1.size() > 0) {
				for (int i = 0; i < list1.size(); i++) {
					WzGoodsStoreinBackSub egsbs = list1.get(i);
					this.wzglDAO.delete(egsbs);
				}
			}

			List<SgccAttachList> listSAL = this.wzglDAO.findByWhere(
					SgccAttachList.class.getName(), "transaction_id ='" + uids + "'");
			if (listSAL.size() > 0) {
				for (int i = 0; i < listSAL.size(); i++) {
					SgccAttachList sal = listSAL.get(i);
					SgccAttachBlob sab = (SgccAttachBlob) this.wzglDAO.findById(SgccAttachBlob.class.getName(), sal.getFileLsh());
					this.wzglDAO.delete(sab);
					this.wzglDAO.delete(sal);
				}
			}
			this.wzglDAO.deleteAll(list);
			return "success";
		} else {
			return "failure";
		}

	}

	public int judgmentWzBackFinished(String uids, String exceFlag, String pid, String flags,String makeType) {
		String updateSql = "";
		List list = this.wzglDAO.findByWhere(WzGoodsStoreinBackSub.class.getName(), "sbrk_uids='" + uids + "' and pid='" + pid + "'");
		if (list.size() == 0) {
			return 3;
		} else if (list.size() > 0) {
			int flag = 0;
			for (int i = 0; i < list.size(); i++) {
				WzGoodsStoreinBackSub equGoodsStoreinSub = new WzGoodsStoreinBackSub();
				equGoodsStoreinSub = (WzGoodsStoreinBackSub) list.get(i);

				if ("".equals(equGoodsStoreinSub.getInWarehouseNo())
						|| equGoodsStoreinSub.getInWarehouseNo() == null
						|| equGoodsStoreinSub.getInWarehouseNo() == 0) {
					flag = 2;
					break;
				} else if ("".equals(equGoodsStoreinSub.getIntoMoney())
						|| equGoodsStoreinSub.getIntoMoney() == null
						|| equGoodsStoreinSub.getIntoMoney() == 0) {
					flag = 2;
					break;
				} else if ("".equals(equGoodsStoreinSub.getTotalMoney())
						|| equGoodsStoreinSub.getTotalMoney() == null
						|| equGoodsStoreinSub.getTotalMoney() == 0) {
					flag = 2;
					break;
					// }else if("".equals(equGoodsStoreinSub.getEquno()) ||
					// equGoodsStoreinSub.getEquno() == null ||
					// "0".equals(equGoodsStoreinSub.getEquno())){
					// flag = 2;
					// break;
				}
			}
			if (flag == 2) {
				return 2;
			} else {
				// 对完结的数据存入设备库存里面去
				String resule = this.finishWzBackRkGoodsStorein(uids, pid,flags,makeType);
				if ("success".equals(resule)) {
					updateSql = " update wz_goods_storein_back t set t.finished='0' where t.uids='"
							+ uids + "' and t.pid='" + pid + "'";
					JdbcUtil.execute(updateSql);
					return 0;
				} else {
					return 1;
				}
			}
		}
		return 1;
	}

	@SuppressWarnings("unchecked")
	public String finishWzBackRkGoodsStorein(String uids, String pid,String flags,String makeType) {
		String whereSql = "";
		List<WzGoodsStoreinBack> list = this.wzglDAO.findByWhere(WzGoodsStoreinBack.class.getName(), "uids='" + uids + "'");
		WzGoodsStoreinBack equGoodsStorein = (WzGoodsStoreinBack) list.get(0);
		List<WzGoodsStoreinBackSub> getSubList = this.wzglDAO.findByWhere(WzGoodsStoreinBackSub.class.getName(),
				"sbrk_uids='" + uids + "' and pid='" + pid + "' order by uids");
		for (int i = 0; i < getSubList.size(); i++) {
			WzGoodsStock equGoodsStock = new WzGoodsStock();
			WzGoodsStoreinBackSub obj = (WzGoodsStoreinBackSub) getSubList.get(i);
			whereSql = "conid='" + equGoodsStorein.getConid()
					+ "' and treeuids='" + equGoodsStorein.getTreeUids()
					+ "' and box_no='" + obj.getBoxNo()
					+ "' and equ_part_name='" + obj.getWarehouseName()
					+ "' and pid='" + pid + "' and makeType='"+makeType+"'" +
				     "  and stockNo='"+obj.getStockno()+"'";
			List<WzGoodsStock> listKC = this.wzglDAO.findByWhere(WzGoodsStock.class.getName(), whereSql);
			if (listKC.size() == 0) {
				equGoodsStock.setPid(pid);
				equGoodsStock.setConid(equGoodsStorein.getConid());
				equGoodsStock.setTreeuids(equGoodsStorein.getTreeUids());
				equGoodsStock.setBoxNo(obj.getBoxNo());
				equGoodsStock.setEquType(obj.getWarehouseType());
				equGoodsStock.setEquPartName(obj.getWarehouseName());
				equGoodsStock.setGgxh(obj.getGgxh());
				equGoodsStock.setGraphNo(obj.getGraphNo());
				equGoodsStock.setUnit(obj.getUnit());
				equGoodsStock.setWeight(obj.getWeight());
				equGoodsStock.setStorage(obj.getEquno());
				equGoodsStock.setStockNum(obj.getInWarehouseNo());
				equGoodsStock.setStorage(obj.getEquno());
				equGoodsStock.setJudgmentFlag(flags);
				equGoodsStock.setMakeType(makeType);
				equGoodsStock.setStockNo(obj.getStockno());
				//统计库存金额：库存金额=该物资所有完结入库单的入库金额合计-该物资所有完结出库单的出库金额合计
				Double  getIntoTotalMoney = 0.00;
				Double  getOuntTotalMoney = 0.00;
				String where = "  sbrkUids in (select uids  from WzGoodsStoreinBack  where finished = '0' " +
						" and judgmentFlag = 'body') and warehouseName='"+obj.getWarehouseName()+"' and warehouseType='"+
						obj.getWarehouseType()+"' and  stockno='"+obj.getStockno()+"' and ggxh='"+obj.getGgxh()+"'";
				List<WzGoodsStoreinBackSub> list1 = this.wzglDAO.findByWhere(WzGoodsStoreinBackSub.class.getName(), where);
			    if(list1.size()>0){
					for(int k=0;k<list1.size();k++){
						WzGoodsStoreinBackSub sub = list1.get(k);
				    	getIntoTotalMoney += sub.getTotalMoney(); 
				    }
			    }
			    String where2 = " outId in (select uids from WzGoodsOutBack where finished = '1'and judgmentFlag = 'body')" +
			    		"  and equPartName='"+obj.getWarehouseName()+"' and equType='"+obj.getWarehouseType()+"' and boxNo='"+obj.getStockno()+"' and ggxh='"+obj.getGgxh()+"'";
			    List<WzGoodsOutBackSub> list2 = this.wzglDAO.findByWhere(WzGoodsOutBackSub.class.getName(), where2);
 				if(list2.size()>0){
 					for(int j=0;j<list2.size();j++){
 						WzGoodsOutBackSub outSub = list2.get(j);
 						getOuntTotalMoney += outSub.getAmount();
 					}
 				}
 				equGoodsStock.setKcMoney(getIntoTotalMoney+obj.getTotalMoney()-getOuntTotalMoney);
				this.wzglDAO.insert(equGoodsStock);
			} else {
				equGoodsStock = (WzGoodsStock) listKC.get(0);
				equGoodsStock.setStockNum(equGoodsStock.getStockNum()
						+ obj.getInWarehouseNo());
				this.wzglDAO.saveOrUpdate(equGoodsStock);
			}
		}
		return "success";
	}

	@SuppressWarnings("unchecked")
	public String wzGoodsIntoWarehousingFromZGRK(String newNo, String uids, String pid) {
		List<WzGoodsStoreinEstimate> list = this.wzglDAO.findByWhere(WzGoodsStoreinEstimate.class.getName(), "uids='" + uids + "'");
		if (list.size() > 0) {
			WzGoodsStoreinEstimate egse = list.get(0);
			WzGoodsStorein egs = new WzGoodsStorein();
			egs.setPid(pid);
			egs.setConid(egse.getConid());
			egs.setTreeUids(egse.getTreeUids());
			egs.setFinished(Byte.parseByte("1"));
			egs.setWarehouseNo(newNo);
			egs.setWarehouseDate(new Date());
			egs.setNoticeNo(egse.getNoticeNo());
			egs.setWarehouseMan(egse.getWarehouseMan());
			egs.setMakeMan(egse.getMakeMan());
			egs.setAbnormalOrNo(egse.getAbnormalOrNo());
			egs.setSupplyunit(egse.getSupplyunit());
			egs.setOpenBoxId(egse.getOpenBoxId());
			egs.setUids(egse.getUids());
			egs.setInvoiceno(egse.getInvoiceno());
			egs.setEquid(egse.getEquid());
			egs.setFileid(egse.getFileid());
			// egs.setWarehouseBackNo();
			egs.setType("正式入库");
			egs.setWarehouseZgrkNo(egse.getWarehouseNo());
			egs.setJudgmentFlag(egse.getJudgmentFlag());
			this.wzglDAO.insert(egs);
			List<WzGoodsStoreinEstimateSub> list1 = this.wzglDAO.findByWhere(
					WzGoodsStoreinEstimateSub.class.getName(), "sbrk_uids='" + uids + "'");
			if (list1.size() > 0) {
				for (int i = 0; i < list1.size(); i++) {
					WzGoodsStoreinEstimateSub egsb = list1.get(i);
					WzGoodsStoreinSub egss = new WzGoodsStoreinSub();
					egss.setSbrkUids(egs.getUids());
					egss.setGgxh(egsb.getGgxh());
					egss.setMemo(egsb.getMemo());
					egss.setPid(egsb.getPid());
					egss.setBoxNo(egsb.getBoxNo());
					egss.setWarehouseType(egsb.getWarehouseType());
					egss.setWarehouseName(egsb.getWarehouseName());
					egss.setGraphNo(egsb.getGgxh());
					egss.setUnit(egsb.getUnit());
					egss.setWarehouseNum(egsb.getWarehouseNum());
					egss.setInWarehouseNo(egsb.getInWarehouseNo());
					egss.setIntoMoney(egsb.getIntoMoney());
					egss.setTotalMoney(egsb.getTotalMoney());
					egss.setEquno(egsb.getEquno());
					egss.setBoxSubId(egsb.getBoxSubId());
					egss.setWeight(egsb.getWeight());
					egss.setStockno(egsb.getStockno());
					egss.setTaxes(egsb.getTaxes());
					egss.setTotalnum(egsb.getTotalnum());
					egss.setUnitPrice(egsb.getUnitPrice());
					egss.setAmountMoney(egsb.getAmountMoney());
					egss.setFreightMoney(egsb.getFreightMoney());
					egss.setInsuranceMoney(egsb.getInsuranceMoney());
					egss.setAntherMoney(egsb.getAntherMoney());
					egss.setAmountTax(egsb.getAmountTax());
					egss.setFreightTax(egsb.getFreightTax());
					egss.setInsuranceTax(egsb.getInsuranceTax());
					egss.setAntherTax(egsb.getAntherTax());
					this.wzglDAO.insert(egss);
				}
			}
			return "success";
		} else {
			return "failure";
		}
	}

	/**
	 * 更新材料暂估出库主表信息
	 * 
	 * @param equOut
	 * @return
	 */
	public String addOrUpdateWzOutEstimate(WzGoodsOutEstimate equOut) {
		String uids = equOut.getUids();
		if (uids == null || uids.equals("")) {
			this.wzglDAO.insert(equOut);
			return equOut.getUids();
		} else {
			this.wzglDAO.saveOrUpdate(equOut);
/*			String where = " outId = '" + uids + "'";
			List<WzGoodsOutEstimateSub> list = this.wzglDAO.findByWhere(
					WzGoodsOutEstimateSub.class.getName(), where);

			// 处理存货编码
			// EquGoodsStockOut out = (EquGoodsStockOut)
			// this.equipmentDAO.findById(EquGoodsStockOut.class.getName(), uids);
			List<EquWarehouse> listWare = this.wzglDAO.findByWhere(
					EquWarehouse.class.getName(), "equid = '"
							+ equOut.getEquid() + "'");
			EquWarehouse warehouse = new EquWarehouse();
			if (listWare.size() > 0) {
				warehouse = listWare.get(0);
			}
			String prefix = warehouse.getWaretypecode() + "-"
					+ warehouse.getWarenocode() + "-";
			String stockno = "";

			String sql = "select trim(to_char(nvl(max(substr(box_no,length('"
					+ prefix + "') +1, 4)),0) +1,'0000')) "
					+ " from wz_goods_out_estimate_sub where 1=1 "
					+ " and  substr(box_no,1,length('" + prefix + "')) ='"
					+ prefix + "'";
			List<String> listStr = this.wzglDAO.getDataAutoCloseSes(sql);
			if (listStr != null) {
				stockno = listStr.get(0);
			}

			for (int i = 0; i < list.size(); i++) {
				WzGoodsOutEstimateSub outSub = list.get(i);

				if (outSub != null) {
					outSub.setBoxNo(prefix + stockno);// 存货编码
					this.wzglDAO.saveOrUpdate(outSub);

					Integer n = Integer.parseInt(stockno);
					stockno = String.format("%04d", n + 1);
				}

			}*/
			return equOut.getUids();
		}
	}

	/**
	 * 从库存中选择材料到暂估出库单明细
	 * 
	 * @param uids
	 * @param id
	 * @param no
	 * @return
	 */
	public String insertWzEstimateOutSubFromStock(String[] uids, String id, String no) {
		for (int i = 0; i < uids.length; i++) {
			WzGoodsStock stock = (WzGoodsStock) this.wzglDAO.findById(WzGoodsStock.class.getName(), uids[i]);

			if (stock != null) {
				WzGoodsOutEstimateSub outSub = new WzGoodsOutEstimateSub();
				outSub.setOutId(id);
				outSub.setOutNo(no);
				outSub.setPid(stock.getPid());
				// outSub.setBoxNo(stock.getBoxNo());
				outSub.setEquType(stock.getEquType());
				outSub.setEquPartName(stock.getEquPartName());
				outSub.setGgxh(stock.getGgxh());
				outSub.setGraphNo(stock.getGraphNo());
				outSub.setOutNum(0d);
				outSub.setStorage(stock.getStorage());
				outSub.setUnit(stock.getUnit());
				outSub.setStockId(stock.getUids());
				outSub.setBoxNo(stock.getStockNo());
				outSub.setPrice(stock.getIntoMoney());
				outSub.setKcMoney(stock.getKcMoney());
				this.wzglDAO.saveOrUpdate(outSub);
			}
		}
		return "1";
	}

	/**
	 * 选择时做选择
	 * @param uids
	 * @param id
	 * @param no
	 * @return
	 */
	public String insertWzOutEsSubFromStock(String[] uids, String id, String no) {
		for (int i = 0; i < uids.length; i++) {
			WzGoodsStock stock = (WzGoodsStock) this.wzglDAO.findById(WzGoodsStock.class.getName(), uids[i]);

			if (stock != null) {
				WzGoodsOutEstimateSub outSub = new WzGoodsOutEstimateSub();
				outSub.setOutId(id);
				outSub.setOutNo(no);
				outSub.setPid(stock.getPid());
				outSub.setEquType(stock.getEquType());
				outSub.setEquPartName(stock.getEquPartName());
				outSub.setGgxh(stock.getGgxh());
				outSub.setGraphNo(stock.getGraphNo());
				outSub.setOutNum(0d);
				outSub.setStorage(stock.getStorage());
				outSub.setUnit(stock.getUnit());
				outSub.setStockId(stock.getUids());
				this.wzglDAO.saveOrUpdate(outSub);
			}
		}
		return "1";
	}

	/**
	 * 从库存中获取设备的库存数量
	 */
	public Double getStockNumFromStock(String id) {
		WzGoodsStock stock = (WzGoodsStock) this.wzglDAO.findById(WzGoodsStock.class.getName(), id);
		if (stock != null) {
			return stock.getStockNum();
		}
		return new Double(0);
	}

	/**
	 * 获取设备出库数量
	 */
	public Double getOutNumFromOutSub(String id) {
		WzGoodsStockOutSub sub = (WzGoodsStockOutSub) this.wzglDAO.findById(WzGoodsStockOutSub.class.getName(), id);
		if (sub != null) {
			return sub.getOutNum();
		}
		return 0d;

	}

	public int updateStockNum(Double newstocknum, String id) {
		String updateSql = "update wz_goods_stock e set e.stock_Num="
				+ newstocknum + " where uids='" + id + "'";
		int result = JdbcUtil.update(updateSql);
		return result;
	}

	/**
	 * 暂估出库单完结
	 * 
	 * @param uids
	 * @return
	 */
	public String wzOutEstimateFinished(String uids) {
		WzGoodsOutEstimate out = (WzGoodsOutEstimate) this.wzglDAO.findById(WzGoodsOutEstimate.class.getName(), uids);
		if (out == null)
			return "0";
		if (out.getIsInstallation() == 1) {
			return "2";
		}
		Integer i = out.getFinished();
		out.setFinished((i == null || i == 0) ? 1 : 0);
		this.wzglDAO.saveOrUpdate(out);
		return "1";
	}

	/**
	 * 暂估出库删除
	 * 
	 * @param uids
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String deleteWzEstimateOutAndOutSub(String uids) {
		if (uids != null && !"".equals(uids)) {
			WzGoodsOutEstimate out = (WzGoodsOutEstimate) this.wzglDAO.findById(WzGoodsOutEstimate.class.getName(), uids);
			if (out != null) {
				List<WzGoodsOutEstimateSub> uousub = this.wzglDAO.findByWhere(WzGoodsOutEstimateSub.class.getName(), "outId='" + uids + "'");
				if (uousub.size() > 0) {
					String updateSql = "merge into wz_goods_stock e using "
							+ "(select s.stock_id,s.out_Num from wz_goods_out_estimate_sub s where s.out_id='"
							+ uids + "' and s.out_Num <> 0) o on(e.uids=o.stock_Id) when matched "
							+ "then update set e.stock_Num=e.stock_Num+o.out_Num ";
					String deleteSql = "delete from wz_goods_out_estimate_sub s where s.out_id='" + uids + "'";
					JdbcUtil.update(updateSql);
					JdbcUtil.execute(deleteSql);
				}
				List<SgccAttachList> listSAL = this.wzglDAO.findByWhere(
						SgccAttachList.class.getName(), "transaction_id ='" + uids + "'");
				if (listSAL.size() > 0) {
					for (int i = 0; i < listSAL.size(); i++) {
						SgccAttachList sal = listSAL.get(i);
						SgccAttachBlob sab = (SgccAttachBlob) this.wzglDAO.findById(SgccAttachBlob.class.getName(), sal.getFileLsh());
						this.wzglDAO.delete(sab);
						this.wzglDAO.delete(sal);
					}
				}
				this.wzglDAO.delete(out);
				return "0";
			}
		}
		return "1";
	}

	/**
	 * 冲回出库进行选择后把暂估出库的数据保存到冲回出库表中
	 * @param uids
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String insertWzGoodsOutBack(String uids, String newCkNo) {
		List<WzGoodsOutEstimate> list = this.wzglDAO.findByWhere(WzGoodsOutEstimate.class.getName(), "uids='" + uids + "'");
		if (list.size() > 0) {
			WzGoodsOutEstimate egoe = list.get(0);
			WzGoodsOutBack egob = new WzGoodsOutBack();
			egob.setPid(egoe.getPid());
			egob.setConid(egoe.getConid());
			egob.setTreeuids(egoe.getTreeuids());
			egob.setFinished(0);
			egob.setIsInstallation(0);
			egob.setOutNo(egoe.getOutNo());
			egob.setOutDate(new Date());
			egob.setRecipientsUnit(egoe.getRecipientsUnit());
			egob.setGrantDesc(egoe.getGrantDesc());
			egob.setRecipientsUser(egoe.getRecipientsUser());
			egob.setRecipientsUnitManager(egoe.getRecipientsUnitManager());
			egob.setHandPerson(egoe.getHandPerson());
			egob.setShipperNo(egoe.getHandPerson());
			egob.setProUse(egoe.getProUse());
			egob.setEquid(egoe.getEquid());
			egob.setFileid(egoe.getFileid());
			egob.setUsing(egoe.getUsing());
			egob.setEquname(egoe.getEquname());
			egob.setOutOutNo(newCkNo);
			egob.setJudgmentFlag(egoe.getJudgmentFlag());
			egob.setKks(egoe.getKks());
			egob.setUserPart(egoe.getUserPart());
			egob.setType("冲回出库");
			this.wzglDAO.insert(egob);
			List<WzGoodsOutEstimateSub> listSub = this.wzglDAO.findByWhere(
					WzGoodsOutEstimateSub.class.getName(), "out_id='" + uids + "'");
			if (listSub.size() > 0) {
				for (int i = 0; i < listSub.size(); i++) {
					WzGoodsOutEstimateSub egoes = listSub.get(i);
					WzGoodsOutBackSub egobs = new WzGoodsOutBackSub();
					egobs.setPid(egoes.getPid());
					egobs.setOutId(egob.getUids());
					egobs.setOutNo(newCkNo);
					egobs.setBoxNo(egoes.getBoxNo());
					egobs.setEquType(egoes.getEquType());
					egobs.setEquPartName(egoes.getEquPartName());
					egobs.setGgxh(egoes.getGgxh());
					egobs.setGraphNo(egoes.getGraphNo());
					egobs.setUnit(egoes.getUnit());
					if (egoes.getOutNum() == null) {
						egobs.setOutNum(0d);
					} else {
						egobs.setOutNum(-egoes.getOutNum());
					}
					egobs.setStorage(egoes.getStorage());
					egobs.setStockId(egoes.getStockId());
					if (egoes.getPrice() == null) {
						egobs.setPrice(0.00);
					} else {
						egobs.setPrice(-egoes.getPrice());
					}
					if (egoes.getAmount() == null) {
						egobs.setAmount(0.00);
					} else {
						egobs.setAmount(-egoes.getAmount());
					}
					this.wzglDAO.insert(egobs);
				}
			}
			return "success";
		} else {
			return "failure";
		}
	}

	/**
	 * 材料冲回入库删除
	 * 
	 * @param uids
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String deleteWzOutBackAndOutBackSub(String uids) {
		if (uids != null && !"".equals(uids)) {
			WzGoodsOutBack out = (WzGoodsOutBack) this.wzglDAO.findById(WzGoodsOutBack.class.getName(), uids);
			if (out != null) {
				List<WzGoodsOutBackSub> uousub = (List<WzGoodsOutBackSub>) this.wzglDAO.findByWhere(WzGoodsOutBackSub.class.getName(), "outId='" + uids + "'");
				if (uousub.size() > 0) {
					String deleteSql = "delete from wz_goods_out_back_sub s where s.out_id='" + uids + "'";
					JdbcUtil.execute(deleteSql);
				}
				List<SgccAttachList> listSAL = this.wzglDAO.findByWhere(
						SgccAttachList.class.getName(), "transaction_id ='" + uids + "'");
				if (listSAL.size() > 0) {
					for (int i = 0; i < listSAL.size(); i++) {
						SgccAttachList sal = listSAL.get(i);
						SgccAttachBlob sab = (SgccAttachBlob) this.wzglDAO.findById(SgccAttachBlob.class.getName(), sal.getFileLsh());
						this.wzglDAO.delete(sab);
						this.wzglDAO.delete(sal);
					}
				}
				this.wzglDAO.delete(out);
				return "0";
			}
		}
		return "1";
	}

	/**
	 * 材料冲回入库完结操作
	 * 
	 * @param uids
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String wzOutBackFinished(String uids) {
		WzGoodsOutBack out = (WzGoodsOutBack) this.wzglDAO.findById(WzGoodsOutBack.class.getName(), uids);
		if (out == null)
			return "0";
		if (out.getIsInstallation() == 1) {
			return "2";
		}
		Integer i = out.getFinished();
		out.setFinished((i == null || i == 0) ? 1 : 0);
		this.wzglDAO.saveOrUpdate(out);
		if (out != null) {
			List<WzGoodsOutBackSub> list = this.wzglDAO.findByWhere(
					WzGoodsOutBackSub.class.getName(), "out_id='" + out.getUids() + "'");
			if (list.size() > 0) {
				for (int j = 0; j < list.size(); j++) {
					WzGoodsOutBackSub egoes = list.get(j);
					String where = "uids='" + egoes.getStockId() + "' and conid='" + out.getConid() + "'";
					List<WzGoodsStock> egsArray = this.wzglDAO.findByWhere(WzGoodsStock.class.getName(), where);
					if (egsArray.size() > 0) {
						WzGoodsStock egs = egsArray.get(0);
						egs.setStockNum(egs.getStockNum() - egoes.getOutNum());
						this.wzglDAO.saveOrUpdate(egs);
					}
				}
			}
		}
		return "1";
	}

	/**
	 * 正式出库从暂估出库中选
	 * 
	 * @param uids
	 * @param newOutNO
	 * @return
	 */
	public String insertWzFromOutEstimateToOutStock(String uids, String newOutNO) {
		WzGoodsOutEstimate equge = (WzGoodsOutEstimate) this.wzglDAO.findById(WzGoodsOutEstimate.class.getName(), uids);
		if (equge != null) {
			WzGoodsStockOut equGs = new WzGoodsStockOut();
			equGs.setPid(equge.getPid());
			equGs.setConid(equge.getConid());
			equGs.setTreeuids(equge.getTreeuids());
			equGs.setFinished(0);
			equGs.setIsInstallation(0);
			equGs.setOutNo(newOutNO);
			equGs.setOutDate(new Date());
			equGs.setRecipientsUnit(equge.getRecipientsUnit());
			equGs.setGrantDesc(equge.getGrantDesc());
			equGs.setRecipientsUser(equge.getRecipientsUser());
			equGs.setRecipientsUnitManager(equge.getRecipientsUnitManager());
			equGs.setHandPerson(equge.getHandPerson());
			equGs.setShipperNo(equge.getShipperNo());
			equGs.setProUse(equge.getProUse());
			equGs.setEquid(equge.getEquid());
			equGs.setFileid(equge.getFileid());
			equGs.setUsing(equge.getUsing());
			equGs.setEquname(equge.getEquname());
			equGs.setOutEstimateNo(equge.getOutNo());
			equGs.setJudgmentFlag(equge.getJudgmentFlag());
			equGs.setKks(equge.getKks());
			equGs.setUserPart(equge.getUserPart());
			equGs.setType("正式出库");
			this.wzglDAO.saveOrUpdate(equGs);
			String where = "out_id='" + uids + "'";
			List<WzGoodsOutEstimateSub> listSub = this.wzglDAO.findByWhere(WzGoodsOutEstimateSub.class.getName(), where);
			if (listSub.size() > 0) {
				for (int i = 0; i < listSub.size(); i++) {
					WzGoodsOutEstimateSub equges = listSub.get(i);
					WzGoodsStockOutSub equgsos = new WzGoodsStockOutSub();
					equgsos.setPid(equges.getPid());
					equgsos.setOutId(equGs.getUids());
					equgsos.setOutNo(newOutNO);
					equgsos.setBoxNo(equges.getBoxNo());
					equgsos.setEquType(equges.getEquType());
					equgsos.setEquPartName(equges.getEquPartName());
					equgsos.setGgxh(equges.getGgxh());
					equgsos.setGraphNo(equges.getGraphNo());
					equgsos.setUnit(equges.getUnit());
					equgsos.setOutNum(equges.getOutNum());
					equgsos.setStorage(equges.getStorage());
					equgsos.setStockId(equges.getStockId());
					equgsos.setPrice(equges.getPrice());
					equgsos.setAmount(equges.getAmount());
					this.wzglDAO.insert(equgsos);
					WzGoodsStock equGst = (WzGoodsStock) this.wzglDAO.findById(WzGoodsStock.class.getName(), equgsos.getStockId());
					equGst.setStockNum(equGst.getStockNum() - equgsos.getOutNum());
					this.wzglDAO.insert(equGst);
				}
			}
			return "success";
		}

		return "failure";
	}

	public String resetWzGoodsOutEstimate(String uids) {
		if (!uids.equals("")) {
			String where = "out_id='" + uids + "'";
			List<WzGoodsOutEstimateSub> list = this.wzglDAO.findByWhere(WzGoodsOutEstimateSub.class.getName(), where);
			if (list.size() > 0) {
				for (int i = 0; i < list.size(); i++) {
					WzGoodsOutEstimateSub egoes = list.get(i);
					egoes.setOutNum(-egoes.getOutNum());
					egoes.setPrice(-egoes.getPrice());
					egoes.setAmount(-egoes.getAmount());
					this.wzglDAO.saveOrUpdate(egoes);
				}
			}
			return "success";
		} else {
			return "failure";
		}
	}
	/**
	 * 设备主体设备出入库保存或修改
	 * 
	 * @param equGoodsBodys
	 * @return
	 */
	public String wzBodySaveOrUpdate(WzGoodsBodys wzGoodsBodys) {
		String uids = wzGoodsBodys.getUids();
		if (uids.equals("")) {// 新增
			this.wzglDAO.insert(wzGoodsBodys);
		} else {// 修改
			this.wzglDAO.saveOrUpdate(wzGoodsBodys);
		}
		return "success";
	}

	/**
	 * @author yanglh
	 * 2013年4月22日 
	 * 材料主体设备暂估入库从表新增时保存记录
	 * @param equGsESub
	 * @return
	 */
	public String saveOrUpdataWzGoodsStoreinEstimateSub(WzGoodsStoreinEstimateSub wzGsESub) {
		this.wzglDAO.insert(wzGsESub);
		return "success";
	}

	/**
	 * @author yanglh
	 * 2013年4月22日 
	 * 材料主体设备正式入库从表新增时保存记录
	 * @param equGsESub
	 * @return
	 */
	public String saveOrUpdataWzGoodsStoreinSub(WzGoodsStoreinSub wzGsSub) {
		this.wzglDAO.insert(wzGsSub);
		return "success";
	}

	@Override
	public String saveWzEsSubFromEquGoodsBody(String[] getUids, String sbrkUids) {
		for(int i=0;i<getUids.length;i++){
			WzGoodsBodys getEquGB = (WzGoodsBodys)this.wzglDAO.findById(WzGoodsBodys.class.getName(), getUids[i]);
			if(getEquGB == null){
				continue;
			}
			WzGoodsStoreinEstimateSub eges = new WzGoodsStoreinEstimateSub();
			eges.setSbrkUids(sbrkUids);
			eges.setStockno(getEquGB.getEquNo());
			eges.setWarehouseName(getEquGB.getEquName());
			eges.setGgxh(getEquGB.getGgxh());
			eges.setPid(getEquGB.getPid());
			String updateSql =  "update Wz_Goods_Bodys set del_or_update='0' where uids='"+getEquGB.getUids()+"'";
			this.wzglDAO.updateBySQL(updateSql);
			this.wzglDAO.insert(eges);
		}
		return "success";
	}

	@Override
	public String saveWzIntoSubFromEquGoodsBody(String[] getUids,
			String sbrkUids) {
		for(int i=0;i<getUids.length;i++){
			WzGoodsBodys getEquGB = (WzGoodsBodys)this.wzglDAO.findById(WzGoodsBodys.class.getName(), getUids[i]);
			if(getEquGB == null){
				continue;
			}
			WzGoodsStoreinSub eges = new WzGoodsStoreinSub();
			eges.setSbrkUids(sbrkUids);
			eges.setStockno(getEquGB.getEquNo());
			eges.setWarehouseName(getEquGB.getEquName());
			eges.setGgxh(getEquGB.getGgxh());
			eges.setPid(getEquGB.getPid());
			this.wzglDAO.insert(eges);
			getEquGB.setDelOrUpdate("0");
			String update = "update Wz_Goods_Bodys set del_or_update='0' where uids='"+getUids[i]+"'";
			this.wzglDAO.updateBySQL(update);
			this.wzglDAO.saveOrUpdate(getEquGB);
		}
		return "success";
	}

	/**
	 * @author yanglh
	 * @date 2013年4月27日
	 * @title 综合部生产部出入库选择物资功能实现
	 * @param uids
	 * @param inId
	 * @param pid
	 * @return
	 */
	public String insertWzbmIntoMatStoreInSub(String[] uids,String inId,String pid) {
		if(uids.length>0){
			for(int i = 0 ; i < uids.length ; i ++){
				String getUids = uids[i];
				WzBm wzbm = (WzBm) this.wzglDAO.findById(WzBm.class.getName(), getUids);
				if(wzbm !=null){
					MatStoreInsub  matSub = new MatStoreInsub();
					matSub.setInId(inId);
					matSub.setPid(pid);
					matSub.setCatNo(wzbm.getBm());
					matSub.setCatName(wzbm.getPm());
					matSub.setSpec(wzbm.getGg());
					matSub.setUnit(wzbm.getDw());
					matSub.setMaterial(wzbm.getWzProperty());
					this.wzglDAO.insert(matSub);
				}
			}
			return "success";
		}else{
		    return null;
		}
	}

	/**
	 * 材料明细有箱件的粘贴功能
	 * @param parts
	 * @return
	 */
	public String pasteWzOpenboxPart(WzGoodsOpenboxSubPart[] parts) {
		for (int i = 0; i < parts.length; i++) {
			this.wzglDAO.insert(parts[i]);
		}
		return "1";
	}

	@Override
	public List<ColumnTreeNode> WzBodyTreeList(String parentId, String whereStr) {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String [] parentIf=parentId.split("`");
		String treeIdIf="";
		if(parentIf.length>1){
			treeIdIf=parentIf[1];
		}
		parentId=parentIf[0];
		String str="";
		
		if(parentId!=null &&!"".equals(parentId)){
		   str = " parentid='"+parentId+"'";
		}else {
			 str = "start with  parentid='0'";
		}
		if(treeIdIf !=null &&!"".equals(treeIdIf)){
			str +=" and treeid not in ('" + treeIdIf + "')";
		}
		List<WzConBodyTreeView> list1 = this.wzglDAO.findByWhere2(WzConBodyTreeView.class.getName(),str);
		for(int i=0;i<list1.size();i++){
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			WzConBodyTreeView ecotv = (WzConBodyTreeView) list1.get(i);
			Long leaf = ecotv.getIsleaf();			
			n.setId(ecotv.getTreeid());
			n.setText(ecotv.getName());
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("icon-cmp");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("icon-pkg");	// treenode.iconCls   icon-pkg 文件夹样式    task-folder
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(ecotv);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}

	/**
	 * 主体材料从采购合同选择物资
	 * @author yanglh 2013-6-8
	 * @param getUids
	 * @param getBm
	 * @param pid
	 * @param selectConid
	 * @param selectTreeid
	 * @return
	 */
	public boolean wzAddBodyFromConMat(String[] getUids, String getBm,String pid, String selectConid,String selectTreeid) {
		String stockno = "";
		String sql = "select trim(to_char(nvl(max(substr(equ_no,length('"
				+ getBm + "') +1, 4)),0) +1,'0000')) "
				+ " from WZ_GOODS_BODYS where pid = '" + pid + "' "
				+ " and  substr(equ_no,1,length('" + getBm + "')) ='"
				+ getBm + "'";
		List<String> listStr = this.wzglDAO.getDataAutoCloseSes(sql);
		if (listStr != null) {
			stockno = listStr.get(0);
		}
		for(int i=0 ;i < getUids.length;i++){
			WzGoodsBodys wgbs = new WzGoodsBodys();
			ConMat conMat = (ConMat) this.wzglDAO.findById(ConMat.class.getName(), getUids[i]);
			if(conMat == null) return false;
			wgbs.setConid(selectConid);
			wgbs.setTreeUids(selectTreeid);
			wgbs.setEquNo(getBm+stockno);
			wgbs.setEquName(conMat.getPm());
			wgbs.setGgxh(conMat.getGg());
			wgbs.setCreateDate(new Date());
			wgbs.setPid(pid);
			wgbs.setEquParts("0");
			wgbs.setJudgmentFlag("body");
			this.wzglDAO.insert(wgbs);
			int index = 1;
			int n=Integer.parseInt(stockno.substring(index))+1;  
			String newValue=String.valueOf(n);  
			int len=stockno.length()-newValue.length()-index;  
			for(int k=0;k<len+1;k++){  
			  newValue ="0"+newValue;  
			}  
			stockno = newValue;
		}
		return true;
	}

	/**
	 * 出入库稽核管理树
	 * @param parentId	父节点ID
	 * @param whereStr	sql查询条件
	 * @param conid		合同ID
	 * @return	出入库稽核管理树节点的稽核
	 * @author pengy
	 */
	public List<ColumnTreeNode> intoAndOutAuditTreeList(String parentId, String whereStr, String conid) {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String str="";
		if(parentId != null && !"".equals(parentId)){
			str = " parentid='"+parentId+"'";
		}
		if(conid != null && !"".equals(conid)){
			str += " and conid='" + conid + "'";
		}
		if(whereStr != null && !"".equals(whereStr)){
			str += whereStr;
		}
		List<WzglConOveTreeView> list1 = this.wzglDAO.findByWhere2(WzglConOveTreeView.class.getName(),str);
		for(int i=0;i<list1.size();i++){
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			WzglConOveTreeView wcotv = (WzglConOveTreeView) list1.get(i);
			Long leaf = wcotv.getIsleaf();			
			n.setId(wcotv.getTreeid()+"$"+wcotv.getConid());
			n.setText(wcotv.getName());
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("icon-cmp");			
			} else {
				n.setLeaf(false);
				n.setCls("master-task");
				n.setIconCls("icon-pkg");
			}
			cn.setTreenode(n);
			JSONObject jo = JSONObject.fromObject(wcotv);
			cn.setColumns(jo);					
			list.add(cn);
		}
		return list;
	}

	//获取清单数量
	@SuppressWarnings("rawtypes")
	public int getQcCount(String equNo){
		int count = 0;
		String hql = "select e.qcId from WzGoodsStockOutSub e where e.boxNo = '"+equNo+"' and e.qcId is not null";
		List list = this.wzglDAO.findByHql(hql);
		String str = "";
		for(int i=0;i<list.size();i++){
			if(list.size() == 1){
	    		str = list.get(i).toString();
	    	}else{
	    		if(i>=0&&i<list.size()-1){
	    			str +=list.get(i).toString()+",";
	    		}else{
	    			str += list.get(i).toString();
	    		}
	    	}
		}
		String [] arr = str.split(",");
		String qc = "";
		for(int j=0;j<arr.length;j++){
			if(arr.length == 1){
				qc = "'"+arr[j]+"'";
	    	}else{
	    		if(j>=0&&j<arr.length-1){
	    			qc += "'"+arr[j]+"',";
	    		}else{
	    			qc += "'"+arr[j]+"'";
	    		}
	    	}
		}
		String hql1 = "select e.uids from EquGoodsQc e where e.uids in ("+qc+")";
		List list1 = this.wzglDAO.findByHql(hql1);
		count = list1.size();
		return count;
	}

	//获取qcId
	public String getQcUids(String equNo){
		String str = "";
		String hql = "select e.qcId from WzGoodsStockOutSub e where e.boxNo = '"+equNo+"' and e.qcId is not null";
		List list = this.wzglDAO.findByHql(hql);
		for(int i=0;i<list.size();i++){
			if(list.size() == 1){
	    		str = list.get(i).toString();
	    	}else{
	    		if(i>=0&&i<list.size()-1){
	    			str +=list.get(i).toString()+",";
	    		}else{
	    			str += list.get(i).toString();
	    		}
	    	}
		}
		String [] arr = str.split(",");
		String qc = "";
		for(int j=0;j<arr.length;j++){
			if(arr.length == 1){
				qc = "'"+arr[j]+"'";
	    	}else{
	    		if(j>=0&&j<arr.length-1){
	    			qc += "'"+arr[j]+"',";
	    		}else{
	    			qc += "'"+arr[j]+"'";
	    		}
	    	}
		}
		return qc;
	}

	/**
	 * 主体材料记录完结时的出入库主从表信息做台账
	 * yanglh	2013-8-9
	 * @param pid
	 * @param mainTable
	 * @param fromTableUids 从表主键
	 * @param fromTableSubNum 从表填写时的数量
	 * @param inOrOut:RK--记录入库信息，CK--记录出库信息
	 */
	@SuppressWarnings("unchecked")
	public void insertCLSubToFinishedRecord(String pid, String mainTableUids,
			String fromTableUids, String fromTableSubNum, String inOrOut) {
		if(inOrOut.equals("RK")){
			WzGoodsStorein getEquGS = (WzGoodsStorein)this.wzglDAO.findById(WzGoodsStorein.class.getName(), mainTableUids);
			//先查询数据是否存在，如存在删除，
			List<EquGoodsFinishedRecord> delList = this.wzglDAO.findByWhere(EquGoodsFinishedRecord.class.getName(), "finiUids='"+mainTableUids+"'");
			if(delList.size()>0){
				this.wzglDAO.deleteAll(delList);
			}
			List<WzGoodsStoreinSub> list = this.wzglDAO.findByWhere(WzGoodsStoreinSub.class.getName(), "sbrk_uids='"+mainTableUids+"'");
			if(list.size()>0){
				for(int i = 0;i < list.size();i ++){
					WzGoodsStoreinSub getSub = list.get(i);
					EquGoodsFinishedRecord equRecord = new EquGoodsFinishedRecord();
					equRecord.setPid(getEquGS.getPid());
					equRecord.setConid(getEquGS.getConid());
					equRecord.setFiniTime(new Date());
					equRecord.setFiniUids(getEquGS.getUids());
					equRecord.setFiniNo(getEquGS.getWarehouseNo());
					equRecord.setFiniSubUids(getSub.getSbrkUids());
					equRecord.setFiniSubNo(getSub.getStockno());
					equRecord.setFiniSubNum(getSub.getInWarehouseNo());
					//取库存物资相同编码的 数量的和，库存金额的和及最大的单价三者的值
				    String sql = "select  nvl(sum(t.stock_num),0),nvl(sum(t.kc_money),0),nvl(max(t.into_money),0) " +
				    		     " from Wz_Goods_Stock t where t.judgment_flag='EQUBODY' and t.make_type='正式入库' " +
				    		     " and t.stock_no='"+getSub.getStockno()+"'";
				    List<Object[]> tempList = this.wzglDAO.getDataAutoCloseSes(sql);
				    for(Object[] obj:tempList){
						equRecord.setFiniStockNum(Double.valueOf(obj[0].toString()));
						equRecord.setFiniStockPrice(Double.valueOf(obj[2].toString()));
						equRecord.setFiniStockMoney(Double.valueOf(obj[1].toString()));				    	
				    }
					equRecord.setFiniInOut("RK");
					equRecord.setFiniType("CL");
					this.wzglDAO.insert(equRecord);
				}
			}
		}else if(inOrOut.equals("CK")){
			EquGoodsFinishedRecord equRecord = new EquGoodsFinishedRecord();
			WzGoodsStockOut stockOut = (WzGoodsStockOut)this.wzglDAO.findById(WzGoodsStockOut.class.getName(), mainTableUids);
			WzGoodsStockOutSub outSub = (WzGoodsStockOutSub) this.wzglDAO.findById(WzGoodsStockOutSub.class.getName(), fromTableUids);
			//查询台账中有无数据
			List<EquGoodsFinishedRecord> getList = this.wzglDAO.findByWhere(EquGoodsFinishedRecord.class.getName(), "finiSubUids='"+fromTableUids+"' and finiUids='"+mainTableUids+"'");
			if (getList != null) {
				equRecord.setFiniSubNum(Double.valueOf(fromTableSubNum));
				this.wzglDAO.saveOrUpdate(equRecord);
			} else {
				equRecord.setPid(stockOut.getPid());
				equRecord.setConid(stockOut.getConid());
				equRecord.setFiniTime(new Date());
				equRecord.setFiniUids(stockOut.getUids());
				equRecord.setFiniNo(stockOut.getOutNo());
				equRecord.setFiniSubUids(outSub.getUids());
				equRecord.setFiniSubNo(outSub.getBoxNo());
				equRecord.setFiniSubNum(Double.valueOf(fromTableSubNum));
				// 取库存物资相同编码的 数量的和，库存金额的和及最大的单价三者的值
				String sql = "select  nvl(sum(t.stock_num),0),nvl(sum(t.kc_money),0),nvl(max(t.into_money),0) "
						+ " from Equ_Goods_Stock t where t.data_type='EQUBODY' "
						+ " and t.stock_no='" + outSub.getBoxNo() + "'";
				List<Object[]> tempList = this.wzglDAO.getDataAutoCloseSes(sql);
				for (Object[] obj : tempList) {
					equRecord.setFiniStockNum(Double.valueOf(obj[0].toString()));
					equRecord.setFiniStockPrice(Double.valueOf(obj[2].toString()));
					equRecord.setFiniStockMoney(Double.valueOf(obj[1].toString()));
				}
				equRecord.setFiniInOut("CK");
				equRecord.setFiniType("CL");
				this.wzglDAO.insert(equRecord);
			}
		}
	}

	@SuppressWarnings("unchecked")
	public String doSelectInSubToOutSub(String[] inSubUidsArr, String outUids, String outNo) {
		for (int i = 0; i < inSubUidsArr.length; i++) {
			String inSubUids = inSubUidsArr[i];
			WzGoodsStoreinSub inSub = (WzGoodsStoreinSub) this.wzglDAO.findById(WzGoodsStoreinSub.class.getName(), inSubUids);
			WzGoodsStorein in = (WzGoodsStorein) this.wzglDAO.findById(WzGoodsStorein.class.getName(), inSub.getSbrkUids());
			WzGoodsStockOutSub outSub = new WzGoodsStockOutSub();
			List<WzGoodsStock> list = this.wzglDAO.findByWhere(WzGoodsStock.class.getName(),
					" stockNo='" + inSub.getStockno() + "' and joinUnit='" + in.getJoinUnit() +
					"' AND judgmentFlag='body' AND makeType='正式入库'");
			WzGoodsStock stock = new WzGoodsStock();
			if (list.size() > 0)
				stock = list.get(0);

			outSub.setOutId(outUids);
			outSub.setOutNo(outNo);
			outSub.setPid(inSub.getPid());
			outSub.setEquType(inSub.getWarehouseType());
			outSub.setEquPartName(inSub.getWarehouseName());
			outSub.setGgxh(inSub.getGgxh());
			outSub.setGraphNo(inSub.getGraphNo());
			outSub.setOutNum(0D);
			outSub.setStorage(inSub.getEquno());
			outSub.setUnit(inSub.getUnit());
			outSub.setStockId(stock.getUids());
			outSub.setBoxNo(inSub.getStockno());
			outSub.setPrice(inSub.getIntoMoney());

			outSub.setInUids(in.getUids());
			outSub.setInSubUids(inSub.getUids());
			outSub.setInNum(inSub.getInWarehouseNo());
			outSub.setSpecial(in.getSpecial());
			outSub.setJzNo(inSub.getJzNo());

			String totMonSql = " SELECT nvl(SUM(s.amount),0) FROM wz_goods_stock_out t, wz_goods_stock_out_sub s " +
						" WHERE t.uids = s.out_id AND t.judgment_flag = 'body' AND t.type = '正式出库' " +
						" AND s.box_no = '"+inSub.getStockno()+"' AND s.in_sub_uids = '"+inSub.getUids()+"'";
			
			List<BigDecimal> totalmoney = this.wzglDAO.getDataAutoCloseSes(totMonSql);
			outSub.setKcMoney(inSub.getTotalMoney() - totalmoney.get(0).doubleValue());
			//出库从表中的库存余额，直接初始化从入库金额取值
			
			this.wzglDAO.saveOrUpdate(outSub);
		}

		return "1";
	}

	/**
	 * 暂估入库冲回
	 * @param uids
	 * @param wz
	 * @return “success” 成功，“failure” 失败
	 * @author yanlgh 2013-11-14
	 */
	@SuppressWarnings("unchecked")
	public String zgrkInsertChrkAndZsrkWz(String uids, WzGoodsStorein wz) {
		if(uids.equals("")){
			return "failure";
		}
		if (wz.getType().equals("冲回入库")){
			wz.setFinishedDate(new Date());
			wz.setFinishedUser(this.getCurrentUserid());
		}
		this.wzglDAO.insert(wz);
		//获取对应主表的从表记录
		List<WzGoodsStoreinSub> list =  this.wzglDAO.findByWhere(WzGoodsStoreinSub.class.getName(), "sbrkUids='"+uids+"'");
		for(int i = 0; i < list.size(); i++){
			WzGoodsStoreinSub wzSub = list.get(i);
			WzGoodsStoreinSub newWzSub = new WzGoodsStoreinSub();
			newWzSub.setGgxh(wzSub.getGgxh());
			newWzSub.setMemo(wzSub.getMemo());
			newWzSub.setPid(wzSub.getPid());
			newWzSub.setSbrkUids(wz.getUids());
			newWzSub.setBoxNo(wzSub.getBoxNo());
			newWzSub.setWarehouseType(wzSub.getWarehouseType());
			newWzSub.setWarehouseName(wzSub.getWarehouseName());
			newWzSub.setUnit(wzSub.getUnit());
			newWzSub.setTotalMoney(wz.getType().equals("冲回入库")?(-wzSub.getTotalMoney()):wzSub.getTotalMoney());
			newWzSub.setEquno(wzSub.getEquno());
			newWzSub.setWeight(wzSub.getWeight());
			newWzSub.setStockno(wzSub.getStockno());
			newWzSub.setTaxes(wz.getType().equals("冲回入库")?(-wzSub.getTaxes()):wzSub.getTaxes());
			newWzSub.setTotalnum(wz.getType().equals("冲回入库")?(-wzSub.getTotalnum()):wzSub.getTotalnum());
			newWzSub.setAmountMoney(wz.getType().equals("冲回入库")?(-wzSub.getAmountMoney()):wzSub.getAmountMoney());
			newWzSub.setFreightMoney(wz.getType().equals("冲回入库")?(-wzSub.getFreightMoney()):wzSub.getFreightMoney());
			newWzSub.setInsuranceMoney(wz.getType().equals("冲回入库")?(-wzSub.getInsuranceMoney()):wzSub.getInsuranceMoney());
			newWzSub.setAntherMoney(wz.getType().equals("冲回入库")?(-wzSub.getAntherMoney()):wzSub.getAntherMoney());
			newWzSub.setAmountTax(wz.getType().equals("冲回入库")?(-wzSub.getAmountTax()):wzSub.getAmountTax());
			newWzSub.setFreightTax(wz.getType().equals("冲回入库")?(-wzSub.getFreightTax()):wzSub.getFreightTax());
			newWzSub.setInsuranceTax(wz.getType().equals("冲回入库")?(-wzSub.getInsuranceTax()):wzSub.getInsuranceTax());
			newWzSub.setAntherTax(wz.getType().equals("冲回入库")?(-wzSub.getAntherTax()):wzSub.getAntherTax());
			newWzSub.setInWarehouseNo(wz.getType().equals("冲回入库")?(-wzSub.getInWarehouseNo()):wzSub.getInWarehouseNo());
			newWzSub.setWarehouseNum(wz.getType().equals("冲回入库")?(-wzSub.getWarehouseNum()):wzSub.getWarehouseNum());
			newWzSub.setGraphNo(wzSub.getGraphNo());
			newWzSub.setUnitPrice(wzSub.getUnitPrice());
			newWzSub.setIntoMoney(wzSub.getIntoMoney());
			newWzSub.setJzNo(wzSub.getJzNo());
			this.wzglDAO.insert(newWzSub);
			if(wz.getType().equals("冲回入库")){
				List<WzGoodsStock> listKC = null;
				String whereSql = "conid='" + wz.getConid() + "' and pid='" + wz.getPid() + "' and join_unit='"
						+ wz.getJoinUnit() + "' and stockNo='" + newWzSub.getStockno() + "'";
			    listKC = this.wzglDAO.findByWhere(WzGoodsStock.class.getName(), whereSql);
			    Double beforeInNum = 0d;
			    Double beforeInMoney = 0d;
			    if(listKC.size()>0){
			    	WzGoodsStock wzGoodsStock = (WzGoodsStock) listKC.get(0);
					
					beforeInNum = wzGoodsStock.getStockNum() == null ? 0d : wzGoodsStock.getStockNum();
				    beforeInMoney = wzGoodsStock.getKcMoney() == null ? 0d : wzGoodsStock.getKcMoney();
				    
					wzGoodsStock.setEquType(newWzSub.getWarehouseType());
					wzGoodsStock.setEquPartName(newWzSub.getWarehouseName());
					wzGoodsStock.setGgxh(newWzSub.getGgxh());
					wzGoodsStock.setUnit(newWzSub.getUnit());
					wzGoodsStock.setIntoMoney(newWzSub.getIntoMoney());
					wzGoodsStock.setStockNum(beforeInNum + (newWzSub.getInWarehouseNo() == null?0d:newWzSub.getInWarehouseNo()));
					wzGoodsStock.setKcMoney(beforeInMoney + (newWzSub.getTotalMoney() == null?0d:newWzSub.getTotalMoney()));
					wzGoodsStock.setStorage(newWzSub.getEquno());
					wzGoodsStock.setSpecial(wz.getSpecial());
					wzGoodsStock.setJzNo(newWzSub.getJzNo());
					this.wzglDAO.saveOrUpdate(wzGoodsStock);
				}

				// 主体材料冲回入库加入物资台账 pengy 2014-08-06
				insertEquGoodsTz(wz.getType(), wz, newWzSub);
			}
		}
		return "success";
	}

	/**
	 * 暂估出库冲回
	 * @param uids
	 * @param WzGoodsStockOut wzOut
	 * @return  “success” 成功，“failure” 失败
	 * @author yanlgh 2013-11-19
	 */
	@SuppressWarnings("unchecked")
	public String zgckInsertChckAndZsckWzOut(String uids, WzGoodsStockOut wzOut) {
		if(uids.equals("")){
			return "failure";
		}
		if (wzOut.getType().equals("冲回出库")){
			wzOut.setFinishedDate(new Date());
			wzOut.setFinishedUser(this.getCurrentUserid());
		}
		this.wzglDAO.insert(wzOut);
		//获取对应主表的从表记录
		List<WzGoodsStockOutSub> list =  this.wzglDAO.findByWhere(WzGoodsStockOutSub.class.getName(), "outId='"+uids+"'");
		if(list.size() == 0){
			return "failure";
		}
		for(int i = 0; i < list.size(); i++){
			WzGoodsStockOutSub wzOutSub = list.get(i);
			WzGoodsStockOutSub newWzOutSub = new WzGoodsStockOutSub();
			newWzOutSub.setPid(wzOutSub.getPid());
			newWzOutSub.setOutId(wzOut.getUids());
			newWzOutSub.setOutNo(wzOutSub.getOutNo());
			newWzOutSub.setBoxNo(wzOutSub.getBoxNo());
			newWzOutSub.setEquType(wzOutSub.getEquType());
			newWzOutSub.setEquPartName(wzOutSub.getEquPartName());
			newWzOutSub.setGgxh(wzOutSub.getGgxh());
			newWzOutSub.setGraphNo(wzOutSub.getGraphNo());
			newWzOutSub.setUnit(wzOutSub.getUnit());
			newWzOutSub.setOutNum(wzOut.getType().equals("冲回出库")?(-wzOutSub.getOutNum()):wzOutSub.getOutNum());
			newWzOutSub.setPrice(wzOutSub.getPrice());
			newWzOutSub.setAmount(wzOut.getType().equals("冲回出库")?(-wzOutSub.getAmount()):wzOutSub.getAmount());
			newWzOutSub.setStorage(wzOutSub.getStorage());
			newWzOutSub.setKcMoney(wzOutSub.getKcMoney());
			newWzOutSub.setUseParts(wzOutSub.getUseParts());
			newWzOutSub.setKksNo(wzOutSub.getKksNo());
			newWzOutSub.setInNum(wzOutSub.getInNum());
			newWzOutSub.setInUids(wzOutSub.getInUids());
			newWzOutSub.setInSubUids(wzOutSub.getInSubUids());
			newWzOutSub.setStockId(wzOutSub.getStockId());
			newWzOutSub.setMemo(wzOutSub.getMemo());
			newWzOutSub.setEquBoxNo(wzOutSub.getEquBoxNo());
			newWzOutSub.setJzNo(wzOutSub.getJzNo());
			WzGoodsStorein in = (WzGoodsStorein) this.wzglDAO.findById(WzGoodsStorein.class.getName(), wzOutSub.getInUids());
			newWzOutSub.setSpecial(in.getSpecial());
			
			this.wzglDAO.insert(newWzOutSub);
			if(wzOut.getType().equals("冲回出库") || wzOut.getType().equals("正式出库")){
				List<WzGoodsStock> listKC = null;
				String whereSql = "conid='" + wzOut.getConid() + "' and pid='" + wzOut.getPid() + "' and join_unit='"
								+ wzOut.getRecipientsUnit() + "' and stockNo = '" + newWzOutSub.getBoxNo() + "'";
			    listKC = this.wzglDAO.findByWhere(WzGoodsStock.class.getName(), whereSql);
			    Double beforeInNum = 0d;
			    Double beforeInMoney = 0d;
			    if(listKC.size()>0){
			    	WzGoodsStock wzGoodsStock = new WzGoodsStock();
					wzGoodsStock = (WzGoodsStock) listKC.get(0);
					
					beforeInNum = wzGoodsStock.getStockNum() == null ? 0d : wzGoodsStock.getStockNum();
				    beforeInMoney = wzGoodsStock.getKcMoney() == null ? 0d : wzGoodsStock.getKcMoney();
				    
					wzGoodsStock.setEquType(newWzOutSub.getEquType());
					wzGoodsStock.setEquPartName(newWzOutSub.getEquPartName());
					wzGoodsStock.setGgxh(newWzOutSub.getGgxh());
					wzGoodsStock.setUnit(newWzOutSub.getUnit());
					wzGoodsStock.setStockNum(beforeInNum - (newWzOutSub.getOutNum() == null?0d:newWzOutSub.getOutNum()));
					wzGoodsStock.setKcMoney(beforeInMoney - (newWzOutSub.getAmount() == null?0d:newWzOutSub.getAmount()));
					wzGoodsStock.setStorage(newWzOutSub.getStorage());
					this.wzglDAO.saveOrUpdate(wzGoodsStock);
			    }
			}
			if (wzOut.getType().equals("冲回出库")){
		    	//主体材料冲回出库加入物资台账 pengy 2014-08-06
				insertEquGoodsTz(wzOut.getType(), wzOut, newWzOutSub);
		    }
		}
		return "success";
	}

	/**
	 * 入库冲回时判断库存是否小于0
	 * @param uids
	 * @return ‘1’冲回后库存小于0，‘0’冲回后库存没有小于0的
	 * @author yanglh 2013-12-26
	 */
	@SuppressWarnings("unchecked")
	public String judgmentSubIsSameStock(String uids) {
		String str = "0";
		List<WzGoodsStoreinSub> list = this.wzglDAO.findByWhere(WzGoodsStoreinSub.class.getName(), "sbrkUids='"+uids+"'");
		if(list.size()>0){
			for(int i = 0; i < list.size(); i ++){
				WzGoodsStoreinSub wzSub = list.get(i);
				String whereSql = " 1=1 ";
				if(wzSub.getBoxNo() == null || wzSub.getBoxNo().equals("")){
					whereSql += " and boxNo is null ";
				}else{
					whereSql += " and boxNo='"+wzSub.getBoxNo()+"'";
				}
				if(wzSub.getWarehouseName() == null || wzSub.getWarehouseName().equals("")){
					whereSql += " and warehouseName is null ";
				}else{
					whereSql += " and equPartName='"+wzSub.getWarehouseName()+"'";
				}
				if(wzSub.getUnit() == null || wzSub.getUnit().equals("")){
					whereSql += " and unit is null ";
				}else{
					whereSql += " and unit='"+wzSub.getUnit()+"'";
				}
				if(wzSub.getStockno() == null || wzSub.getStockno().equals("")){
					whereSql += " and stockNo is null";
				}else{
					whereSql += " and stockNo='"+wzSub.getStockno()+"'";
				}
				List<WzGoodsStock> list1 =  this.wzglDAO.findByWhere(WzGoodsStock.class.getName(), whereSql);
				if(list1.size()>0){
					if((wzSub.getWarehouseNum()+list1.get(0).getStockNum()<0)){
						str = "1";
						break;
					}
				}
			}
		}
		return str;
	}

	/**
	 * 后台直接获取session中用户userid
	 * @return
	 * @author zhangh 2013-8-14
	 */
	public String getCurrentUserid(){
		String finiUser = "";
		WebContext webContext = WebContextFactory.get();    
		if(webContext!=null){
			HttpSession session = webContext.getSession() ;
			finiUser = session.getAttribute(Constant.USERID).toString(); 
		}
		return finiUser;
	}

	/**
	 * 主体材料正式、暂估出入库完结插入物资台账
	 * @param type 正式入库，暂估入库，冲回入库，正式出库，暂估出库，冲回出库
	 * @param master 主表对象
	 * @param detail 从表对象
	 * @return
	 * @author pengy 2014-08-06
	 */
	@SuppressWarnings("unchecked")
	private String insertEquGoodsTz(String type, Object master, Object detail){
		String rtn = "0";
		List<String> listTz = null;
		String sqlTz = "";
		EquGoodsTz goodsTz = new EquGoodsTz();
		if ("正式入库".equals(type) || "暂估入库".equals(type) || "冲回入库".equals(type)){
			//入库前的库存数量beforeInNum，金额beforeInMoney，单价beforeInPrice
			//现在出库明细改为从入库明细中选择，不再根据存货编码合并物资，故一条入库明细，就是一种物资 pengy 2013-11-07
			WzGoodsStorein in = (WzGoodsStorein)master;
			WzGoodsStoreinSub obj = (WzGoodsStoreinSub)detail;
			goodsTz.setPid(in.getPid());
			goodsTz.setType("ZTCLRK-"+obj.getUids());
			goodsTz.setShrq(new Date());
			goodsTz.setChbm(obj.getStockno());
			goodsTz.setChmc(obj.getWarehouseName());
			goodsTz.setGgxh(obj.getGgxh());
			goodsTz.setDw(obj.getUnit());
			goodsTz.setInNum(obj.getInWarehouseNo());
			goodsTz.setInPrice(obj.getIntoMoney());
			goodsTz.setInAmount(obj.getTotalMoney());
			goodsTz.setOutNum(0d);
			goodsTz.setOutPrice(0d);
			goodsTz.setOutAmount(0d);
			goodsTz.setLlyt("");
			goodsTz.setCwkm("");
			goodsTz.setRiqi(in.getWarehouseDate());
			goodsTz.setDanhao(in.getWarehouseNo());
			goodsTz.setInSubUids(obj.getUids());//入库明细主键
			goodsTz.setEquType(type);//暂估入库或正式入库
			goodsTz.setKks("");
			goodsTz.setAzbw("");
			goodsTz.setConttreetype("");
			goodsTz.setFinished(1L);
			//不再合并物资，故期初为0
			goodsTz.setFiniStockNum(0d);
			goodsTz.setFiniStockPrice(0d);
			goodsTz.setFiniStockMoney(0d);
			goodsTz.setStockNum(obj.getInWarehouseNo());
			goodsTz.setStockPrice(obj.getIntoMoney());
			goodsTz.setStockMoney(obj.getTotalMoney());

			sqlTz = "select (select b.wareno FROM equ_warehouse b WHERE b.parent='01' AND b.waretype=" +
					"a.waretype) wareparent FROM equ_warehouse a WHERE a.equid='"+in.getEquid()+"'";
			listTz = this.wzglDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setCangkuType(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "select wareno FROM equ_warehouse b WHERE b.equid='"+in.getEquid()+"'";
			listTz = this.wzglDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setCangku(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "SELECT c.DETAIL_TYPE FROM property_code c WHERE c.type_name=(SELECT t.uids FROM" +
					" property_type t WHERE t.type_name='主体设备参与单位') AND c.property_code='"+in.getJoinUnit()+"'";
			listTz = this.wzglDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setKczz(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "SELECT C.CONNO FROM CON_OVE C WHERE C.CONID='"+in.getConid()+"'";
			listTz = this.wzglDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setConno(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");

			sqlTz = "SELECT B.PARTYB FROM CON_PARTYB B WHERE B.CPID=(SELECT C.PARTYBNO FROM CON_OVE C WHERE C.CONID='"+in.getConid()+"')";
			listTz = this.wzglDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setGhdw(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "SELECT U.REALNAME FROM ROCK_USER U WHERE U.USERID='"+in.getCreateMan()+"'";
			listTz = this.wzglDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setZdr(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "SELECT U.REALNAME FROM ROCK_USER U WHERE U.USERID='"+this.getCurrentUserid()+"'";
			listTz = this.wzglDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setShr(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
		} else if ("正式出库".equals(type) || "暂估出库".equals(type) || "冲回出库".equals(type)){
			//由于出库单明细从入库单明细中选择，且不改变库存，导致库存中数据错误
			//现在改为直接查询入库明细，获得入库数量，入库金额，查询出库明细中此物资总出库数量，出库金额  pengy 2013-11-5
			WzGoodsStockOut out = (WzGoodsStockOut)master;
			WzGoodsStockOutSub obj = (WzGoodsStockOutSub)detail;
			WzGoodsStoreinSub storeinSub = (WzGoodsStoreinSub) this.wzglDAO.findById(WzGoodsStoreinSub.class.getName(), obj.getInSubUids());
			Double storeinNum = 0d;//入库数量
			Double storeinMoney = 0d;//入库金额
			if (storeinSub != null){
				storeinNum = storeinSub.getInWarehouseNo() == null ? 0d : storeinSub.getInWarehouseNo();
				storeinMoney = storeinSub.getTotalMoney() == null ? 0d : storeinSub.getTotalMoney();
			}
			String outSql = "select NVL(SUM(t.out_num),0),NVL(SUM(t.amount),0) from wz_goods_stock_out_sub" +
					" t where t.in_sub_uids='" + obj.getInSubUids() + "'";
			List<Object[]> outSum = this.wzglDAO.getDataAutoCloseSes(outSql);
			Double stockoutNum = 0d;//出库总数量
			Double stockoutMoney = 0d;//出库总金额
			if (outSum != null && outSum.size()>0){
				stockoutNum = ((BigDecimal)outSum.get(0)[0]).doubleValue();
				stockoutMoney = ((BigDecimal)outSum.get(0)[1]).doubleValue();
			}
			//出库后的库存数量afterOutNum，金额afterOutMoney，单价afterOutPrice
			Double afterOutNum = storeinNum - stockoutNum;
			Double afterOutMoney = storeinMoney - stockoutMoney;
			Double afterOutPrice = obj.getPrice() == null ? 0d : obj.getPrice();
			
			goodsTz.setPid(out.getPid());
			goodsTz.setType("ZTCLCK-"+obj.getUids());
			goodsTz.setShrq(new Date());
			goodsTz.setChbm(obj.getBoxNo());
			goodsTz.setChmc(obj.getEquPartName());
			goodsTz.setGgxh(obj.getGgxh());
			goodsTz.setDw(obj.getUnit());
			goodsTz.setInNum(0d);
			goodsTz.setInPrice(0d);
			goodsTz.setInAmount(0d);
			goodsTz.setOutNum(obj.getOutNum());
			goodsTz.setOutPrice(obj.getPrice());
			goodsTz.setOutAmount(obj.getAmount());
			goodsTz.setCwkm(out.getFinancialSubjects());
			goodsTz.setRiqi(out.getOutDate());
			goodsTz.setDanhao(out.getOutNo());
			goodsTz.setInSubUids(obj.getInSubUids());//入库明细主键
			goodsTz.setEquType(out.getType());//暂估出库或正式出库
			goodsTz.setKks(obj.getKksNo());
			goodsTz.setAzbw(obj.getUseParts());
			goodsTz.setConttreetype("");
			goodsTz.setFinished(1L);
			//期初、结存
			if ("冲回出库".equals(type)){
				goodsTz.setFiniStockNum(afterOutNum);
				goodsTz.setFiniStockPrice(afterOutPrice);
				goodsTz.setFiniStockMoney(afterOutMoney);
				goodsTz.setStockNum(afterOutNum - obj.getOutNum());
				goodsTz.setStockPrice(afterOutPrice);
				goodsTz.setStockMoney(afterOutMoney - obj.getAmount());
			} else {
				goodsTz.setFiniStockNum(afterOutNum + obj.getOutNum());
				goodsTz.setFiniStockPrice(afterOutPrice);
				goodsTz.setFiniStockMoney(afterOutMoney + obj.getAmount());
				goodsTz.setStockNum(afterOutNum);
				goodsTz.setStockPrice(afterOutPrice);
				goodsTz.setStockMoney(afterOutMoney);
			}
			
			sqlTz = "select b.bdgname||' - '||b.bdgid FROM bdg_info b WHERE b.bdgid='"+out.getUsing()+"'";
			listTz = this.wzglDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setLlyt(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "select (select b.wareno FROM equ_warehouse b WHERE b.parent='01' AND b.waretype=" +
					"a.waretype) wareparent FROM equ_warehouse a WHERE a.equid='"+out.getEquid()+"'";
			listTz = this.wzglDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setCangkuType(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "select wareno FROM equ_warehouse b WHERE b.equid='"+out.getEquid()+"'";
			listTz = this.wzglDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setCangku(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "SELECT c.property_name FROM property_code c WHERE c.type_name=(SELECT t.uids FROM" +
					" property_type t WHERE t.type_name='领用单位') AND c.property_code='"+out.getRecipientsUnit()+"'";
			listTz = this.wzglDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setKczz(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "SELECT C.CONNO FROM CON_OVE C WHERE C.CONID='"+out.getConid()+"'";
			listTz = this.wzglDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setConno(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
	
			sqlTz = "SELECT B.PARTYB FROM CON_PARTYB B WHERE B.CPID=(SELECT C.PARTYBNO FROM CON_OVE C WHERE C.CONID='"+out.getConid()+"')";
			listTz = this.wzglDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setGhdw(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "SELECT U.REALNAME FROM ROCK_USER U WHERE U.USERID='"+out.getCreateMan()+"'";
			listTz = this.wzglDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setZdr(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "SELECT U.REALNAME FROM ROCK_USER U WHERE U.USERID='"+this.getCurrentUserid()+"'";
			listTz = this.wzglDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setShr(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
		}
		this.wzglDAO.insert(goodsTz);
		return rtn;
	}

}
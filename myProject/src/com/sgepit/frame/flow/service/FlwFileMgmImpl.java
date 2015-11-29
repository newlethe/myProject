package com.sgepit.frame.flow.service;

import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;

import org.hibernate.Session;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.flow.dao.FlowDAO;
import com.sgepit.frame.flow.hbm.FlwAdjunctIns;
import com.sgepit.frame.flow.hbm.FlwDwrRtnLog;
import com.sgepit.frame.flow.hbm.FlwFiles;
import com.sgepit.frame.flow.hbm.FlwFilesIns;
import com.sgepit.frame.flow.hbm.FlwInstance;
import com.sgepit.frame.flow.hbm.FlwMaterialRemove;
import com.sgepit.frame.flow.hbm.InsFileAdjunctInfoView;
import com.sgepit.frame.flow.hbm.ZlInfo;
import com.sgepit.frame.util.JdbcUtil;

public class FlwFileMgmImpl extends BaseMgmImpl
    implements FlwFileMgmFacade
{
	private FlowDAO flowDAO;
    private String fileBean;
    private String insBean;
    private String fileInsBean;
    private String adjunctInsBean;
    private String insFileAdjunctInfoView;
    private String materialRemove;
    
    public FlwFileMgmImpl()
    {
    	insBean = "com.sgepit.frame.flow.hbm.".concat("FlwInstance");
        fileBean = "com.sgepit.frame.flow.hbm.".concat("FlwFiles");
        fileInsBean = "com.sgepit.frame.flow.hbm.".concat("FlwFilesIns");
        adjunctInsBean = "com.sgepit.frame.flow.hbm.".concat("FlwAdjunctIns");
        insFileAdjunctInfoView = "com.sgepit.frame.flow.hbm.".concat("InsFileAdjunctInfoView");
        materialRemove = "com.sgepit.frame.flow.hbm.".concat("FlwMaterialRemove");
    }

    public static FlwFileMgmImpl getFromApplicationContext(ApplicationContext ctx)
    {
        return (FlwFileMgmImpl)ctx.getBean("flwFileMgm");
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x1#setFlowDAO(com.sgepit.frame.flow.dao.FlowDAO)
	 */
    public void setFlowDAO(FlowDAO flowDAO)
    {
        this.flowDAO = flowDAO;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x1#isOpenModel(java.lang.String, java.lang.String, java.lang.String, java.lang.String)
	 */
    public String isOpenModel(String flowid, String nodeid, String insid, String userid)
    {
        String fileid = "";
        List fileList = flowDAO.findByWhere2(fileBean, (new StringBuilder("flowid='")).append(flowid).append("' and nodeid='").append(nodeid).append("'").toString());
        if(!fileList.isEmpty())
        {
            List insfileList = flowDAO.findByWhere2(fileInsBean, (new StringBuilder("insid='")).append(insid).append("' and nodeid='").append(nodeid).append("' and userid='").append(userid).append("'").toString());
            if(insfileList.isEmpty())
                fileid = ((FlwFiles)fileList.get(0)).getFileid();
        }
        return fileid;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x1#isUploadSign(java.lang.String)
	 */
    public boolean isUploadSign(String userid)
    {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(Constant.DATASOURCE);
        List list = jdbcTemplate.queryForList((new StringBuilder("select * from APP_BLOB where FILEID='")).append(userid).append("'").toString());
        return !list.isEmpty();
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x1#showStr(java.lang.String)
	 */
    public void showStr(String str)
    {
        System.out.println(str);
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x1#removeToZlInfo(java.util.List)
	 */
    @SuppressWarnings("unchecked")
	public boolean removeToZlInfo(List list)
    {
        try
        {
            ZlInfo zlInfo;
            for(Iterator iterator = list.iterator(); iterator.hasNext(); flowDAO.insert(zlInfo))
            {
                zlInfo = (ZlInfo)iterator.next();
                if(zlInfo.getZltype().longValue() == 8L)
                {
                    FlwFilesIns fileins = (FlwFilesIns)flowDAO.findById(fileInsBean, zlInfo.getFilelsh());
                    fileins.setIsmove("1");
                    flowDAO.saveOrUpdate(fileins);
                } else
                if(zlInfo.getZltype().longValue() == 9L)
                {
                    FlwAdjunctIns adjunctIns = (FlwAdjunctIns)flowDAO.findById(adjunctInsBean, zlInfo.getFilelsh());
                    adjunctIns.setIsmove("1");
                    flowDAO.saveOrUpdate(adjunctIns);
                }
            }

        }
        catch(RuntimeException e)
        {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x1#checkyj(java.lang.String)
	 */
    public boolean checkyj(String insid)
    {
        String beanName = ZlInfo.class.getName();
        List list = flowDAO.findByWhere2(beanName, (new StringBuilder("flwinsid='")).append(insid).append("'").toString());
        return list.size() > 0;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x1#getflwfies(java.lang.String)
	 */
    public FlwFiles getflwfies(String insid)
    {
        JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
        String sql = (new StringBuilder("select * from flw_files f, flw_files_ins fi where  f.fileid = fi.fileid and fi.insid='")).append(insid).append("'").toString();
        FlwFiles flwf = new FlwFiles();
        List list = jdbc.queryForList(sql);
        Iterator it = list.iterator();
        if(it.hasNext())
        {
            Map map = (Map)it.next();
            String lsh = (String)map.get("fileid");
            String name = (String)map.get("filename");
            flwf.setFileid(lsh);
            flwf.setFilename(name);
            return flwf;
        } else
        {
            return null;
        }
    }
    public FlwDwrRtnLog removeToZlListJSON(String zlJSON){
    	FlwDwrRtnLog log = new FlwDwrRtnLog();
    	log.setFlag(true);
    	log.setSuccess(true);
    	try{
	    	Map<String,String>  insidmap = new HashMap<String,String>();
    		Map<String,Integer> tmpmap = new HashMap<String,Integer>();
	    	JSONArray ja = JSONArray.fromObject(zlJSON);
		    List zlList = JSONArray.toList(ja, ZlInfo.class);
		    Date nowdate = new Date();
		    for(Iterator it=zlList.iterator();it.hasNext();){
		    	ZlInfo  zlhbm = (ZlInfo) it.next();
		    	String filelsh = zlhbm.getFilelsh();
		    	if(filelsh!=null&&!filelsh.equals("")){
		    		Object objhbm = flowDAO.findById(insFileAdjunctInfoView, filelsh);	
		    		if(objhbm!=null){
		    			InsFileAdjunctInfoView filehbm =(InsFileAdjunctInfoView) objhbm; 
		    			insidmap.put(filehbm.getInsid(), null);
		    			Long ftype = filehbm.getFiletype().equals("WORD")?new Long("8"):new Long("9");
		    			zlhbm.setMaterialname(filehbm.getFilename());  
		    			zlhbm.setStockdate(nowdate);
		    			zlhbm.setFilename(filehbm.getFilename());
		    			zlhbm.setZltype(ftype);
		    			zlhbm.setRkrq(nowdate);
		    			zlhbm.setFlwinsid(filehbm.getInsid());
		    			
		    			String key = filehbm.getInsid().concat("#").concat(filehbm.getFiletype());
		    			String flowno = (filehbm.getFlowno()==null||filehbm.getFlowno().equals("")?"":(filehbm.getFlowno()+"_"));
		    			if(tmpmap.containsKey(key)){
		    				Integer num = tmpmap.get(key)+1;
		    				String fileno = (ftype==8?(flowno+"FLOW_"+num):(flowno+"ATTACH_"+num));
		    				tmpmap.put(key, new Integer(num));
		    				zlhbm.setFileno(fileno);
		    			}else{
		    				int num = flowDAO.findByWhere(ZlInfo.class.getName(), (new StringBuilder()).
		    						append("indexid='").append(zlhbm.getIndexid()).append("'and orgid='").append(zlhbm.getOrgid()).
		    						append("' and flwinsid ='").append(filehbm.getInsid()).append("'").toString()).size()+1;
		    				String fileno =(ftype==8?(flowno+"FLOW_"+num):(flowno+"ATTACH_"+num));
		    				tmpmap.put(key, new Integer(num));
		    				zlhbm.setFileno(fileno);
		    			}
		    			
		    			if(!(this.removeToZlObj(zlhbm))){
		    				log.setFlag(false);
		    				log.setMessage(log.getMessage().concat(filehbm.getFilename()).concat("\n"));
		    			};
		    		}
		    	}
		    }
		    if(!(log.isFlag())){
		    	log.setMessage(log.getMessage());
		    }
		    //FLW_MATERIAL_REMOVE
		    for(Iterator<String> it=insidmap.keySet().iterator();it.hasNext();){
		    	String insid = it.next();
		    	updateRemoveinfo(insid);
		    }
    	}catch(RuntimeException ex){
    		 ex.printStackTrace();
    		 log.setSuccess(false);
    		 log.setErrormsg(ex.getMessage());
    	}    
    	return log;
    };
    public boolean removeToZlObj(ZlInfo zlInfo)
    {
    	try{
        	if(zlInfo.getZltype()!=null){
        		Session ses = HibernateSessionFactory.getSession();
        		if(zlInfo.getZltype()==8){
        			FlwFilesIns fileins = (FlwFilesIns)flowDAO.findById(fileInsBean, zlInfo.getFilelsh());
        			if(fileins != null){
        				fileins.setIsmove("1");
        				ses.saveOrUpdate(fileins);
        				ses.flush();
        				ses.beginTransaction().commit();

        				zlInfo.setZltype(new Long("3"));
        				flowDAO.insert(zlInfo);
        			}
        		}else if(zlInfo.getZltype()==9){
        			FlwAdjunctIns adjunctIns = (FlwAdjunctIns)flowDAO.findById(adjunctInsBean, zlInfo.getFilelsh());
        			if(adjunctIns != null){
        				adjunctIns.setIsmove("1");
        				ses.saveOrUpdate(adjunctIns);
        				ses.flush();
        				ses.beginTransaction().commit();
        				
        				zlInfo.setZltype(new Long("3"));
        				flowDAO.insert(zlInfo);
        			}
        		}
        		ses.close();
        	}
        }catch(RuntimeException e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

	public boolean setRemove(String fileid, String filetype, String ismove) {
		try{
			String insid = "";
			Session ses = HibernateSessionFactory.getSession();
			if(filetype.equalsIgnoreCase("word")){
				FlwFilesIns fileins = (FlwFilesIns)flowDAO.findById(fileInsBean, fileid);
				insid=fileins.getInsid();
				fileins.setIsmove(ismove);
				ses.saveOrUpdate(fileins);
			}else{
				FlwAdjunctIns adjunctIns = (FlwAdjunctIns)flowDAO.findById(adjunctInsBean, fileid);
				insid=adjunctIns.getInsid();
				adjunctIns.setIsmove(ismove);
				ses.saveOrUpdate(adjunctIns);
			}
			
			ses.flush();
			ses.beginTransaction().commit();
			ses.close();
			updateRemoveinfo(insid);
			return true;
		}catch(Exception ex){
			ex.printStackTrace();
			return false;
		}
	}
	
	@SuppressWarnings("unchecked")
	public void updateRemoveinfo(String insid){
		FlwInstance  ins =  (FlwInstance) flowDAO.findById(insBean, insid);
		if(ins!=null){
	    	FlwMaterialRemove revHbm = null;
	    	
	    	List revlist = flowDAO.findByWhere(materialRemove, (new StringBuilder()).append("insid='").append(insid).append("'").toString());
	    	if(revlist.size()>0){
	    		revHbm = (FlwMaterialRemove) revlist.get(0);
	    	}else{
	    		revHbm = new FlwMaterialRemove();
	    		revHbm.setFlwInstance(ins);
	    	}
	    	List lt1 = flowDAO.findByWhere(insFileAdjunctInfoView, (new StringBuilder("insid='")).
	    			append(insid).append("' and ismove<>'-1'").toString());//未移交和已移交文件(除去不需要移交的软件)
	    	List lt2 = flowDAO.findByWhere(insFileAdjunctInfoView, (new StringBuilder("insid='")).
	    			append(insid).append("' and ismove='0'").toString());//未移交文件
	    	if(lt1.size()>0){//未移交和已移交文件
	    		if(lt1.size()==lt2.size()){//全部未移交
	    			revHbm.setRemoveinfo("0");
	    			revHbm.setUnremoveed(null);
	    		}else{
	    			if(lt2.size()==0){//全部移交ȫ���ƽ�
	    				revHbm.setRemoveinfo("1");
	    				revHbm.setUnremoveed(null);
	    			}else{//部分移交
	    				StringBuilder sbd = new StringBuilder();
	    				for(Iterator it2=lt2.iterator();it2.hasNext();){
	    					InsFileAdjunctInfoView filehbm = (InsFileAdjunctInfoView) it2.next();
	    					sbd.append(",").append(filehbm.getFileid());
	    				}
	    				revHbm.setRemoveinfo("-1");
	    				revHbm.setUnremoveed(sbd.toString().substring(1));
	    			}
	    		}
	    	}else{
	    		revHbm.setRemoveinfo("1");
				revHbm.setUnremoveed(null);
	    	}
	    	flowDAO.saveOrUpdate(revHbm);
		}	
	}
}

package com.sgepit.pmis.news.service;

import java.io.InputStream;
import java.util.Date;
import java.util.List;

import com.sgepit.pmis.news.hbm.AppEqu;
import com.sgepit.pmis.news.hbm.AppNews;

public interface AppNewsMgmFacade {

	/**
	 * 获取符合查询条件的所有新闻信息
	 * 
	 * @param stateSelected 发布状态
	 * @param whereStr 动态查询条件
	 * @param orderby 排序条件
	 * author:shangtw
	 * createtime:2012-5-28
	 * @return
	 */
	public List<AppNews> getNews(String stateSelected,String whereStr,String orderby,Integer start, Integer limit);


	/**
	 * 删除单个新闻
	 * @param filePk
	 * @author shangtw
	 * @createtime 2012-5-28
	 * @return
	 */
	public boolean deleteNew(String filePk);

	/**
	 * 批量删除新闻
	 * 
	 * @param filePks
	 * @author shangtw
	 * @createtime 2012-5-28
	 * @return
	 */
	public boolean deleteSelectedNews(String[] filePks);	

	/**
	 * 批量发布新闻
	 * 
	 * @param filePks
	 * @param pubtime
	 * @param userId
	 * @author shangtw
	 * @createtime 2012-5-28
	 * @return
	 * @throws Exception 
	 */
	public boolean publishNews(String[] filePks,String pubtime,String userId) throws Exception;	
	/**
	 * 根据新闻主键得到新闻实体
	 * @param uids
	 * @author shangtw
	 * @createtime 2012-5-28
	 * @return
	 */	
	public AppNews getNewsById(String uids);	
	
	/**
	 * 保存新闻及其新闻附件
	 * @param AppNews
	 * @param InputStream
	 * @author shangtw
	 * @createtime 2012-5-29
	 * @return
	 */
	public String saveLocalNews(AppNews appNews,InputStream inputStream);
	
	/**
	 * 保存设备到货信息登记
	 * @param AppEqu
	 * @param InputStream
	 * @author shangtw
	 * @createtime 2013-3-21
	 * @return
	 */
	public String saveLocalEquInfo(AppEqu appEqu,InputStream inputStream);	
	
	/**
	 * 获取符合查询条件的设备到货信息登记
	 * 
	 * @param stateSelected 发布状态
	 * @param whereStr 动态查询条件
	 * @param orderby 排序条件
	 * author:shangtw
	 * createtime:2013-3-21
	 * @return
	 */
	public List<AppEqu> getEqus(String stateSelected,String whereStr,String orderby,Integer start, Integer limit);
	/**
	 * 隐式发布图片到tomcat下
	 * 
	 * @param filePks
	 * @param pubtime
	 * @param userId
	 * @author shangtw
	 * @createtime 2013-3-21
	 * @return
	 * @throws Exception 
	 */
	public boolean publishEquManagement(String[] filePks,String pubtime,String userId) throws Exception;	
	/**
	 * 删除设备到货信息
	 * @param filePk
	 * @author shangtw
	 * @createtime 2013-3-21
	 * @return
	 */
	public boolean deleteEqu(String filePk);

	/**
	 * 批量设备到货信息
	 * 
	 * @param filePks
	 * @author shangtw
	 * @createtime 2013-3-21
	 * @return
	 */
	public boolean deleteSelectedEqus(String[] filePks);		
	
	
}

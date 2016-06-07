package com.sgepit.frame.base.dao;

import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.context.ApplicationContext;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCallback;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.util.FtpUtil;

//TODO:分离大文档及ftp操作等方法

/**
 * DAO基类，封装了大部分常用的数据访问操作。
 * 
 */
public class BaseDAO extends HibernateDaoSupport {

	private static final Log log = LogFactory.getLog(BaseDAO.class);
	private JdbcTemplate jdbcTemplate;
	/**
	 * do nothing
	 */
	protected void initDao() {
		// do nothing
	}
	public static BaseDAO getFromApplicationContext(ApplicationContext ctx) {
		return (BaseDAO) ctx.getBean("baseDAO");
	}
	
	/**
	 * 插入或更新数据，调用HibernateTemplate的saveOrUpdate方法,捕获相关异常并抛出。
	 * 当数据库中有传入的bean对象对应的记录时进行update操作，否则将进行insert操作。
	 * @param transientInstance 需要保存的bean实例。
	 */
	public void saveOrUpdate(Object transientInstance) {
		log.debug("saveOrUpdate " + transientInstance.getClass().getName());
		try {
			getHibernateTemplate().saveOrUpdate(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}
	/**
	 * 插入数据，调用HibernateTemplate的save方法,捕获相关异常并抛出。
	 * @param transientInstance 需要保存的bean实例。
	 * @return 所保存记录的id.
	 */
	public String insert(Object transientInstance) {
		log.debug("insert " + transientInstance.getClass().getName());
		String id=null;
		try {
			id = getHibernateTemplate().save(transientInstance).toString();
			log.debug("insert successful");
		} catch (RuntimeException re) {
			log.error("insert failed", re);
			throw re;
		}
		return id;
	}

	/**
	 * 删除数据,调用HibernateTemplate的delete方法,捕获相关异常并抛出。
	 * @param persistentInstance 需要删除的bean实例。
	 */
	public void delete(Object persistentInstance) {
		log.debug("delete " + persistentInstance.getClass().getName());
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}	
	
	/**
	 * 删除一组数据,调用HibernateTemplate的deleteAll方法,捕获相关异常并抛出。
	 * @param list 需要删除的bean实例组成的list。
	 */
	public void deleteAll(List list) {
		log.debug("deleteAll");
		try {
			getHibernateTemplate().deleteAll(list);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}
	
	/**
	 * 通过id查询数据,调用HibernateTemplate的get方法,捕获相关异常并抛出。
	 * @param beanName 需要查询数据对应的bean名称(全路径) 
	 * @param id 对应id参数
	 * @return 查询出的bean对象实例
	 */
	public Object findById(String beanName, String id) {
		String table = getTableName(beanName);
		log.info("findById " + table + ", id: " + id);
		try {
			Object instance = (Object) getHibernateTemplate().get(beanName, id);
			return instance;
		} catch (RuntimeException re) {
			log.error("[findById] failed", re);
			throw re;
		}
	}	
	/**
	 * 针对复合id的查询方法,调用HibernateTemplate的get方法,捕获相关异常并抛出。
	 * @param beanName 需要查询数据对应的bean名称(全路径) 。
	 * @param id 对应id对象。
	 * @return 查询出的bean对象实例。
	 */
	public Object findByCompId(String beanName, Serializable id) {
		String table = getTableName(beanName);
		log.debug("getting " + table + " instance with id: " + id);
		try {
			Object instance = (Object) getHibernateTemplate().get(beanName, id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}
	
	/**
	 * 根据指定属性值进行查询。
	 * @param beanName 需要查询数据对应的bean名称(全路径)。
	 * @param propertyName 指定的属性名称。
	 * @param value 指定的属性值。
	 * @return 返回匹配所指定条件的第一条记录对应的bean对象实例。
	 */
	public Object findBeanByProperty(String beanName, String propertyName,
			Object value) {
		String table = getTableName(beanName);
		log.debug("findBeanByProperty" + beanName + ", property: "
				+ propertyName + ", value: " + value);
		try {
			List list = findByProperty(beanName, propertyName, value,null,null,null);
			if (list != null && list.size() > 0) {
				return list.get(0);
			}
			return null;
		} catch (RuntimeException re) {
			log.error("[findBeanByProperty] failed", re);
			throw re;
		}
	}
	/**
	 * 直接使用hql语句进行查询。
	 * @param hql 指定的hql语句。
	 * @return 返回记录list。
	 */
	public List findByHql(String hql) {
		log.debug("execute hql " + hql);
		try {
			return getHibernateTemplate().find(hql);
		} catch (RuntimeException re) {
			log.error(hql, re);
			throw re;
		}
	}
	
	/**
	 * 按照instance所设置的属性值来组合查询语句的where条件
	 * Users anUser = new Users();
	 * anUser.setUserName("a");
	 * anUser.setPassWord("b");
	 * anUser.setRealName("");
	 * 那么where条件就是：where username='a' and password='b' anUser.setRealName("");	
	 * @param instance
	 * @return
	 */
	public List findByExample(Object instance) {
		log.debug("finding instance by example");
		try {
			List results = getHibernateTemplate().findByExample(instance);
			log.debug("find by example successful, result size: "
					+ results.size());
			return results;
		} catch (RuntimeException re) {
			log.error("find by example failed", re);
			throw re;
		}
	}		
	
	/**
	 * 根据传入的where条件进行查询，并可指定返回记录的起始行号、返回记录的排序条件。
	 * @param beanName 需要查询数据对应的bean名称(全路径)。
	 * @param where where条件语句。
	 * @param orderby orderby条件。
	 * @param firstRow 结果起始行号。
	 * @param maxRow 结果记录数限制。
	 * @return 结果list。
	 */
	public List findByWhere(String beanName, String where, String orderby,
			final Integer firstRow, final Integer maxRow) {
		String table = getTableName(beanName);
		log.debug("findWhereOrderBy " + table + ", where: " + where
				+ ", orderby: " + orderby + ", firstRow: " + firstRow
				+ ", maxRow: " + maxRow);
		try {
			String str = "from " + table + " in class " + beanName;
			if (where != null && !where.trim().equals(""))
				str += " where " + where;
			if (orderby != null && !orderby.trim().equals(""))
				str += " order by " + orderby;
			final String hsql = str;
			final String hsqlCount ="select count(*) " + hsql;
			if (firstRow == null || maxRow == null) {
				return findByHql(hsql);
			} else {
				return getHibernateTemplate().executeFind(
						new HibernateCallback() {
							public Object doInHibernate(Session s)
									throws HibernateException, SQLException {
								Query query = s.createQuery(hsql);
								Query queryCount = s.createQuery(hsqlCount);
								Integer size =0 ;
								if(queryCount.list().size()>0){
									size = ((Long)(queryCount.list().get(0))).intValue();
								}
								query.setFirstResult(firstRow.intValue());
								query.setMaxResults(maxRow.intValue());
								List list = query.list();
								list.add(size);
								return list;
							}
						});
			}
		} catch (RuntimeException re) {
			log.error("[findWhereOrderBy] failed", re);
			throw re;
		}
	}
	/**
	 * 根据指定属性值进行查询，并可指定返回记录的起始行号、返回记录的排序条件。
	 * @param beanName 需要查询数据对应的bean名称(全路径).
	 * @param propertyName 指定的属性名称.
	 * @param value 指定的属性值.
	 * @param orderby orderby条件
	 * @param firstRow 结果起始行号.
	 * @param maxRow 结果记录数限制.
	 * @return 结果list
	 */
	public List findByProperty(String beanName, String propertyName,final Object value, String orderby,
			final Integer firstRow, final Integer maxRow) {
		String table = getTableName(beanName);
		log.debug("finding " + table + " instance with property: "
				+ propertyName + ", value: " + value + " and pagenation");
		try {
			String str = "from " + table + " as model where model."
					+ propertyName + "= ?";
			
			if (orderby != null && !orderby.trim().equals(""))
				str += " order by " + orderby;
			final String hsql = str;
			if (firstRow == null || maxRow == null) {
				return getHibernateTemplate().find(hsql, value);
			} else{
				return getHibernateTemplate().executeFind(new HibernateCallback() {
					public Object doInHibernate(Session s)
							throws HibernateException, SQLException {
						Query query = s.createQuery(hsql);
						query.setParameter(0, value);
						Integer size = query.list().size();
						if (firstRow != null && maxRow != null)
						{
							query.setFirstResult(firstRow.intValue());
							query.setMaxResults(maxRow.intValue());
						}
						
						List list = query.list();
						list.add(size);
						return list;
					}
				});
			}
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	private String getTableName(java.lang.String beanName) {
		String table = beanName.indexOf(".") > -1 ? beanName.split("\\.")[beanName
				.split("\\.").length - 1]
				: beanName;
		return table;
	}

	/**
	 * 使用sql语句进行查询。
	 * @param sql 指定的sql语句。
	 * @return 结果list。
	 */
	public List getData(String sql) {
    	List list = null;
    	Session ses = null;
    	if (sql != null && !sql.equals("") )
		{
	    	try {		    		
		    		ses = getSession();			    	
		    		Query q = ses.createSQLQuery(sql);
		    		list = q.list();		    		
		    		
		    	} catch (Exception e) {
		    		e.printStackTrace();
		    	} finally {
		    		ses.close();
	    	}
		}
    	return list;
    }
	
	/**
	 * 使用sql语句进行查询，由系统管理Session，不进行手动关闭。
	 * @param sql 指定的sql语句。
	 * @return 结果list。
	 */
	public List getDataAutoCloseSes(String sql) {
    	List list = null;
    	Session ses = null;
    	if (sql != null && !sql.equals("") )
		{
	    	try {		    		
		    		ses = getSession();			    	
		    		Query q = ses.createSQLQuery(sql);
		    		list = q.list();		    		
		    		
		    	} catch (Exception e) {
		    		e.printStackTrace();
		    	}
		}
    	return list;
    }
	
	/**
	 * 根据指定属性值查询。
	 * @param beanName 需要查询数据对应的bean名称(全路径)。
	 * @param propertyName 指定的属性名称。
	 * @param value 指定的属性值。
	 * @return
	 */
	public List findByProperty(String beanName, String propertyName,final Object value){
		
		return findByProperty(beanName, propertyName, value, null, null, null);
	}
	/**
	 * 根据指定属性值查询，并可指定返回记录的排序条件。
	 * @param beanName 需要查询数据对应的bean名称(全路径)。
	 * @param propertyName 指定的属性名称。
	 * @param value 指定的属性值。
	 * @param orderby orderby条件。
	 * @return 返回数据list。
	 */
	public List findByProperty(String beanName, String propertyName,final Object value,String orderby){
		
		return findByProperty(beanName, propertyName, value, orderby, null, null);
	}
	/**
	 * 根据where条件查询，并可指定返回记录的排序条件。
	 * @param beanName 需要查询数据对应的bean名称(全路径)。
	 * @param where where条件语句。
	 * @param orderby orderby条件。
	 * @return
	 */
	public List findByWhere(String beanName, String where, String orderby){
		
		return findByWhere(beanName, where, orderby,null,null);
	}
	/**
	 * 根据where条件查询。
	 * @param beanName 需要查询数据对应的bean名称(全路径)。
	 * @param where where条件语句。
	 * @return
	 */
	public List findByWhere(String beanName, String where){
		
		return findByWhere(beanName, where, null,null,null);
	}

	public List queryWhereOrderBy(String beanName, String where, String orderby){
		
		return findByWhere(beanName, where, orderby,null,null);
	}
	
	/*
	 * yuw 为了兼容老系统中BaseDAO的该方法。
	 * */
	public List findWhereOrderBy(String beanName, String where, String orderby) {
		return findByWhere(beanName, where, orderby);
	}
	
	/**
	 * 使用sql语句更新数据。
	 * @param sql 指定的sql语句。
	 * @return 更新成功返回1,否者返回0。
	 */
	public int updateBySQL(String sql) {
		int result = 0;
    	Session ses = null;
    	if (sql != null && !sql.equals("") ){
	    	try {
	    		ses = getSession();			    	
	    		Query q = ses.createSQLQuery(sql);
	    		result = q.executeUpdate();	
			} catch (Exception e) {
				e.printStackTrace();
			}		    		
    	}
    	return result;
	}
	/**
	 * 执行hql语句。
	 * @param hql 指定的hql语句。
	 */	
	public final void executeHQL(final String hql) {   
		Session session = null;   
		List<?> ret = null;   
		try {   
		     log.info(hql);   
		          session = this.getSession();   
		         if (hql.toUpperCase().startsWith("DELETE")   
		                   || hql.toUpperCase().startsWith("UPDATE")) {   
		               session.createQuery(hql).executeUpdate();   
		           }
		       } catch (HibernateException e) {   
		           log.error("executeHQL() error:" + hql, e);   
		           throw convertHibernateAccessException(e);   
		        } finally {   
		          this.releaseSession(session);   
	       } 
	}	
	/**
	 * 更新表APP_BLOB中的记录
	 * @param blobid
	 * @param is
	 * @param size
	 * @param isNew
	 * @throws SQLException
	 * @throws IOException
	 */
	public synchronized void updateBlob(final String blobid,
			final InputStream is, final int size, boolean isNew)
			throws SQLException, IOException {
		if (this.jdbcTemplate == null) {
			this.jdbcTemplate = new JdbcTemplate(Constant.DATASOURCE);
		}
		if (isNew) {
			Object execute = this.jdbcTemplate.execute(
					"insert into APP_BLOB (FILEID, BLOB, DATETIME) values (?, ?, sysdate)",
					new PreparedStatementCallback() {
						public Object doInPreparedStatement(
								PreparedStatement pstmt) throws SQLException,
								DataAccessException {
							pstmt.setString(1, blobid);
							pstmt.setBinaryStream(2, is, size);
							pstmt.execute();
							return null;
						}
					});

		} else {
			Object execute = this.jdbcTemplate.execute(
					"update APP_BLOB set BLOB = ?, DATETIME = sysdate where FILEID = ?",
					new PreparedStatementCallback() {
						public Object doInPreparedStatement(
								PreparedStatement pstmt) throws SQLException,
								DataAccessException {
							pstmt.setString(2, blobid);
							pstmt.setBinaryStream(1, is, size);
							pstmt.execute();
							return null;
						}

					});
		}
		is.close();
	}
	/**
	 * 根据fileid检索并返回存放于表APP_BLOB中的二进制流
	 * @param fileid
	 * @param compress 预留，未实现
	 * @return
	 * @throws SQLException
	 */
	public InputStream getBlobInputStream(String fileid, String compress)
			throws SQLException {
		InputStream in = null;
		try {
			if (this.jdbcTemplate == null) {
				this.jdbcTemplate = new JdbcTemplate(Constant.DATASOURCE);
			}
			String sql = "select blob from APP_BLOB where fileid='" + fileid
					+ "'";
			Blob blob = (Blob)this.jdbcTemplate.queryForObject(sql, Blob.class);
			in = blob.getBinaryStream();
		} catch (SQLException ex) {
			throw ex;
		}
		return in;
	}

	/**
	 * 根据fileid检索并返回存放于FTP中文件的二进制流
	 * @param fileid
	 * @param compress
	 * @return
	 * @throws Exception
	 */
	public InputStream getFtpInputStream(String fileid, String compress)
			throws Exception {
		InputStream in = FtpUtil.getFile(fileid, compress);
		return in;
	}

	/**
	 * 根据fileid删除表APP_BLOB中对应的记录
	 * @param fileid
	 */
	public void deleteFileInBlob(String fileid) {
		if (this.jdbcTemplate == null) {
			this.jdbcTemplate = new JdbcTemplate(Constant.DATASOURCE);
		}
		String sql = "delete APP_BLOB where fileid='" + fileid + "'";
		this.jdbcTemplate.execute(sql);
	}
	
	/**
	 * 根据fileid删除FTP中对应的文件
	 * @param fileid
	 */
	public void deleteFileOnFtp(String fileid)throws Exception {
		FtpUtil.ftpDel(fileid);
	}
	
	/** 根据ftp上业务子目录，删除对应目录中的附件信息
	 * 加了transactionType不用遍历ftp下所有的目录，加快检索速度
	 * @param fileid
	 * @param transactionType	业务大对象类型，即子目录名称
	 * @throws Exception
	 * @author: Ivy
	 * @createDate: 2010-1-11
	 */
	public void deleteFileOnFtp(String fileid, String transactionType)throws Exception {
		FtpUtil.ftpDel(fileid, transactionType);
	}
	
	//以下部分为适应pmis原来程序所添加
	/**
	 * 根据where条件查询，并可指定返回记录的排序条件。
	 * @param beanName 需要查询数据对应的bean名称(全路径)。
	 * @param where where条件语句。
	 * @param orderby orderby条件。
	 * @return
	 */
	public List findByWhere3(String beanName, String where, String orderby){
		
		return findByWhere(beanName, where, orderby,null,null);
	}
	/**
	 * 根据where条件查询。
	 * @param beanName 需要查询数据对应的bean名称(全路径)。
	 * @param where where条件语句。
	 * @return
	 */
	public List findByWhere2(String beanName, String where){
		
		return findByWhere(beanName, where, null,null,null);
	}
	public List findByWhere5(String beanName, String where, String orderby,
			final Integer firstRow, final Integer maxRow){
		
		return findByWhere(beanName, where, orderby,firstRow,maxRow);
	}

	public List findOrderBy2(String beanName, String orderby) {
		return findOrderBy(beanName, orderby, null, null);
	}

	public List findOrderBy(String beanName, String orderby,
			final Integer firstRow, final Integer maxRow) {
		String table = getTableName(beanName);
		log.debug("findOrderBy " + table + " orderby: " + orderby
				+ ", firstRow: " + firstRow + ", maxRow: " + maxRow);
		try {
			final String hsql;
			if (orderby != null && !orderby.trim().equals(""))
				hsql = "from " + table + " in class " + beanName + " order by "
						+ orderby;
			else
				hsql = "from " + table + " in class " + beanName;
			if (firstRow == null || maxRow == null) {
				return findByHql(hsql);
			} else {
				return getHibernateTemplate().executeFind(
						new HibernateCallback() {
							public Object doInHibernate(Session s)
									throws HibernateException, SQLException {
								Query query = s.createQuery(hsql);
								Integer size = query.list().size();
								query.setFirstResult(firstRow.intValue());
								query.setMaxResults(maxRow.intValue());
								List list = query.list();
								list.add(size);
								return list;
							}
						});
			}
		} catch (RuntimeException re) {
			log.error("[findOrderBy] failed", re);
			throw re;
		}
	}
	
	/**
	 * 根据Sql，对应的实体类名 查询数据
	 * 仅实体类对应的单表查询时使用如：select * from rock_role where unit_id = '16' or (unit_id in (select unitid from sgcc_ini_unit start with unitid = '16' connect by prior upunit=unitid ) and roletype='2')
	 * 主要解决一般查询方法中in的查询条件带有表的过滤的，用hql语言不能识别的问题
	 * @param beanName
	 * @param sql
	 * @param start
	 * @param limit
	 * @return
	 * @throws DataAccessResourceFailureException
	 * @throws HibernateException
	 * @throws IllegalStateException
	 * @throws ClassNotFoundException
	 * @author: Ivy
	 * @createDate: May 20, 2011
	 */
	public List findBySql(String beanName, String sql, Integer start, Integer limit) throws DataAccessResourceFailureException, HibernateException, IllegalStateException, ClassNotFoundException {
		if (sql!=null && sql.length()>0) {
			SQLQuery query = getSession().createSQLQuery(sql)
				.addEntity(Class.forName(beanName));
			int size = query.list().size();
			if(start!=null && limit!=null) {
				query.setFirstResult(start.intValue());
				query.setMaxResults(limit.intValue());
			}
			List list = query.list();
			list.add(size);
			
			return list;
		} else {
			return new ArrayList();
		}
	}
	/**
	 * 获取session
	 * @return
	 */
	protected final Session getHibernateSession(){
		return getSession();
	}
	public boolean updateByArrSQL(String[] arrSQL){
		try {
			if(arrSQL.length>0){
				Connection conn = HibernateSessionFactory.getConnection();
				Statement stmt =  conn.createStatement();
				conn.setAutoCommit(false);
				for(String sql : arrSQL){
					stmt.addBatch(sql);
				}
				stmt.executeBatch();
				conn.commit();
				stmt.close();
				conn.close();
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
}
package com.sgepit.pmis.zlaq.dao;

import java.util.Date;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.pmis.zlaq.hbm.ZlaqFile;

/**
 * A data access object (DAO) providing persistence and search support for
 * ZlaqFile entities. Transaction control of the save(), update() and delete()
 * operations can directly support Spring container-managed transactions or they
 * can be augmented to handle user-managed Spring transactions. Each of these
 * methods provides additional information for how to configure it for the
 * desired type of transaction control.
 * 
 * @see com.sgepit.pmis.zlaq.hbm.ZlaqFile
 * @author MyEclipse Persistence Tools
 */

public class ZlaqFileDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(ZlaqFileDAO.class);
	// property constants
	public static final String NAME = "name";
	public static final String TYPE = "type";
	public static final String MODELID = "modelid";
	public static final String FILE_LSH = "fileLsh";
	public static final String FILE_NAME = "fileName";
	public static final String FILE_NR = "fileNr";
	public static final String IS_COMPRESS = "isCompress";
	public static final String AUTHOR = "author";
	public static final String VERSION = "version";
	public static final String TRANS_FLAG = "transFlag";
	public static final String TRANS_ID = "transId";
	public static final String BILL_STATE = "billState";
	public static final String MEMO = "memo";
	public static final String MEMOC1 = "memoc1";
	public static final String MEMOC2 = "memoc2";
	public static final String MEMOC3 = "memoc3";
	public static final String MEMOC4 = "memoc4";
	public static final String MEMOC5 = "memoc5";
	public static final String MEMON1 = "memon1";
	public static final String MEMON2 = "memon2";
	public static final String MEMON3 = "memon3";
	public static final String MEMON4 = "memon4";
	public static final String MEMON5 = "memon5";

	protected void initDao() {
		// do nothing
		sBeanName = "com.sgepit.pmis.zlaq.hbm.ZlaqFile";
	}

	public void save(ZlaqFile transientInstance) {
		log.debug("saving ZlaqFile instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(ZlaqFile persistentInstance) {
		log.debug("deleting ZlaqFile instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public ZlaqFile findById(java.lang.String id) {
		log.debug("getting ZlaqFile instance with id: " + id);
		try {
			ZlaqFile instance = (ZlaqFile) getHibernateTemplate().get(
					"com.sgepit.pmis.zlaq.hbm.ZlaqFile", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(ZlaqFile instance) {
		log.debug("finding ZlaqFile instance by example");
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

	public List findByProperty(String propertyName, Object value) {
		log.debug("finding ZlaqFile instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from ZlaqFile as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List findByName(Object name) {
		return findByProperty(NAME, name);
	}

	public List findByType(Object type) {
		return findByProperty(TYPE, type);
	}

	public List findByModelid(Object modelid) {
		return findByProperty(MODELID, modelid);
	}

	public List findByFileLsh(Object fileLsh) {
		return findByProperty(FILE_LSH, fileLsh);
	}

	public List findByFileName(Object fileName) {
		return findByProperty(FILE_NAME, fileName);
	}

	public List findByFileNr(Object fileNr) {
		return findByProperty(FILE_NR, fileNr);
	}

	public List findByIsCompress(Object isCompress) {
		return findByProperty(IS_COMPRESS, isCompress);
	}

	public List findByAuthor(Object author) {
		return findByProperty(AUTHOR, author);
	}

	public List findByVersion(Object version) {
		return findByProperty(VERSION, version);
	}

	public List findByTransFlag(Object transFlag) {
		return findByProperty(TRANS_FLAG, transFlag);
	}

	public List findByTransId(Object transId) {
		return findByProperty(TRANS_ID, transId);
	}

	public List findByBillState(Object billState) {
		return findByProperty(BILL_STATE, billState);
	}

	public List findByMemo(Object memo) {
		return findByProperty(MEMO, memo);
	}

	public List findByMemoc1(Object memoc1) {
		return findByProperty(MEMOC1, memoc1);
	}

	public List findByMemoc2(Object memoc2) {
		return findByProperty(MEMOC2, memoc2);
	}

	public List findByMemoc3(Object memoc3) {
		return findByProperty(MEMOC3, memoc3);
	}

	public List findByMemoc4(Object memoc4) {
		return findByProperty(MEMOC4, memoc4);
	}

	public List findByMemoc5(Object memoc5) {
		return findByProperty(MEMOC5, memoc5);
	}

	public List findByMemon1(Object memon1) {
		return findByProperty(MEMON1, memon1);
	}

	public List findByMemon2(Object memon2) {
		return findByProperty(MEMON2, memon2);
	}

	public List findByMemon3(Object memon3) {
		return findByProperty(MEMON3, memon3);
	}

	public List findByMemon4(Object memon4) {
		return findByProperty(MEMON4, memon4);
	}

	public List findByMemon5(Object memon5) {
		return findByProperty(MEMON5, memon5);
	}

	public List findAll() {
		log.debug("finding all ZlaqFile instances");
		try {
			String queryString = "from ZlaqFile";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public ZlaqFile merge(ZlaqFile detachedInstance) {
		log.debug("merging ZlaqFile instance");
		try {
			ZlaqFile result = (ZlaqFile) getHibernateTemplate().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(ZlaqFile instance) {
		log.debug("attaching dirty ZlaqFile instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(ZlaqFile instance) {
		log.debug("attaching clean ZlaqFile instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static ZlaqFileDAO getInstence() {
		return (ZlaqFileDAO) Constant.wact.getBean("ZlaqFileDAO");
	}

	public static ZlaqFileDAO getFromApplicationContext(ApplicationContext ctx) {
		return (ZlaqFileDAO) ctx.getBean("ZlaqFileDAO");
	}
}
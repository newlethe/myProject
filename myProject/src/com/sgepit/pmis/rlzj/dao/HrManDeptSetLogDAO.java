package com.sgepit.pmis.rlzj.dao;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.pmis.rlzj.hbm.HrManDeptSetLog;

/**
 * A data access object (DAO) providing persistence and search support for
 * HrManDeptSetLog entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.sgepit.pmis.rlzj.hbm.HrManDeptSetLog
 * @author MyEclipse Persistence Tools
 */

public class HrManDeptSetLogDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(HrManDeptSetLogDAO.class);
	// property constants
	public static final String SJ_TYPE = "sjType";
	public static final String USERID = "userid";
	public static final String UNIT_ID = "unitId";
	public static final String DEPT_ID = "deptId";
	public static final String POST_ID = "postId";
	public static final String SET_USER = "setUser";
	public static final String MEMO = "memo";

	protected void initDao() {
		// do nothing
		sBeanName = "com.sgepit.pmis.rlzy.hbm.HrManDeptSetLog";
	}

	public void save(HrManDeptSetLog transientInstance) {
		log.debug("saving HrManDeptSetLog instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(HrManDeptSetLog persistentInstance) {
		log.debug("deleting HrManDeptSetLog instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public HrManDeptSetLog findById(java.lang.String id) {
		log.debug("getting HrManDeptSetLog instance with id: " + id);
		try {
			HrManDeptSetLog instance = (HrManDeptSetLog) getHibernateTemplate()
					.get("com.sgepit.pmis.rlzj.hbm.HrManDeptSetLog", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(HrManDeptSetLog instance) {
		log.debug("finding HrManDeptSetLog instance by example");
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
		log.debug("finding HrManDeptSetLog instance with property: "
				+ propertyName + ", value: " + value);
		try {
			String queryString = "from HrManDeptSetLog as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List findBySjType(Object sjType) {
		return findByProperty(SJ_TYPE, sjType);
	}

	public List findByUserid(Object userid) {
		return findByProperty(USERID, userid);
	}

	public List findByUnitId(Object unitId) {
		return findByProperty(UNIT_ID, unitId);
	}

	public List findByDeptId(Object deptId) {
		return findByProperty(DEPT_ID, deptId);
	}

	public List findByPostId(Object postId) {
		return findByProperty(POST_ID, postId);
	}

	public List findBySetUser(Object setUser) {
		return findByProperty(SET_USER, setUser);
	}

	public List findByMemo(Object memo) {
		return findByProperty(MEMO, memo);
	}

	public List findAll() {
		log.debug("finding all HrManDeptSetLog instances");
		try {
			String queryString = "from HrManDeptSetLog";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public HrManDeptSetLog merge(HrManDeptSetLog detachedInstance) {
		log.debug("merging HrManDeptSetLog instance");
		try {
			HrManDeptSetLog result = (HrManDeptSetLog) getHibernateTemplate()
					.merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(HrManDeptSetLog instance) {
		log.debug("attaching dirty HrManDeptSetLog instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(HrManDeptSetLog instance) {
		log.debug("attaching clean HrManDeptSetLog instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static HrManDeptSetLogDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (HrManDeptSetLogDAO) ctx.getBean("HrManDeptSetLogDAO");
	}
}
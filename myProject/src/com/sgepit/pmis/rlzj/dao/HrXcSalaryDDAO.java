package com.sgepit.pmis.rlzj.dao;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.pmis.rlzj.hbm.HrXcSalaryD;

/**
 * A data access object (DAO) providing persistence and search support for
 * HrXcSalaryD entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.sgepit.pmis.rlzj.hbm.HrXcSalaryD
 * @author MyEclipse Persistence Tools
 */

public class HrXcSalaryDDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(HrXcSalaryDDAO.class);
	// property constants
	public static final String MASTERLSH = "masterlsh";
	public static final String SJ_TYPE = "sjType";
	public static final String UNIT_ID = "unitId";
	public static final String ZB_SEQNO = "zbSeqno";
	public static final String VAL1 = "val1";
	public static final String VAL2 = "val2";
	public static final String VAL3 = "val3";
	public static final String VAL4 = "val4";
	public static final String VAL5 = "val5";
	public static final String VAL6 = "val6";
	public static final String VAL7 = "val7";
	public static final String VAL8 = "val8";
	public static final String VAL9 = "val9";
	public static final String VAL10 = "val10";
	public static final String VAL11 = "val11";
	public static final String VAL12 = "val12";
	public static final String VAL13 = "val13";
	public static final String VAL14 = "val14";
	public static final String VAL15 = "val15";
	public static final String VAL16 = "val16";
	public static final String VAL17 = "val17";
	public static final String VAL18 = "val18";
	public static final String VAL19 = "val19";
	public static final String VAL20 = "val20";
	public static final String VAL21 = "val21";
	public static final String VAL22 = "val22";
	public static final String VAL23 = "val23";
	public static final String VAL24 = "val24";
	public static final String VAL25 = "val25";
	public static final String VAL26 = "val26";
	public static final String VAL27 = "val27";
	public static final String MEMO = "memo";

	protected void initDao() {
		// do nothing
		sBeanName = "com.sgepit.pmis.rlzy.hbm.HrXcSalaryD";
	}

	public void save(HrXcSalaryD transientInstance) {
		log.debug("saving HrXcSalaryD instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(HrXcSalaryD persistentInstance) {
		log.debug("deleting HrXcSalaryD instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public HrXcSalaryD findById(java.lang.String id) {
		log.debug("getting HrXcSalaryD instance with id: " + id);
		try {
			HrXcSalaryD instance = (HrXcSalaryD) getHibernateTemplate().get(
					"com.sgepit.pmis.rlzj.hbm.HrXcSalaryD", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(HrXcSalaryD instance) {
		log.debug("finding HrXcSalaryD instance by example");
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
		log.debug("finding HrXcSalaryD instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from HrXcSalaryD as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List findByMasterlsh(Object masterlsh) {
		return findByProperty(MASTERLSH, masterlsh);
	}

	public List findBySjType(Object sjType) {
		return findByProperty(SJ_TYPE, sjType);
	}

	public List findByUnitId(Object unitId) {
		return findByProperty(UNIT_ID, unitId);
	}

	public List findByZbSeqno(Object zbSeqno) {
		return findByProperty(ZB_SEQNO, zbSeqno);
	}

	public List findByVal1(Object val1) {
		return findByProperty(VAL1, val1);
	}

	public List findByVal2(Object val2) {
		return findByProperty(VAL2, val2);
	}

	public List findByVal3(Object val3) {
		return findByProperty(VAL3, val3);
	}

	public List findByVal4(Object val4) {
		return findByProperty(VAL4, val4);
	}

	public List findByVal5(Object val5) {
		return findByProperty(VAL5, val5);
	}

	public List findByVal6(Object val6) {
		return findByProperty(VAL6, val6);
	}

	public List findByVal7(Object val7) {
		return findByProperty(VAL7, val7);
	}

	public List findByVal8(Object val8) {
		return findByProperty(VAL8, val8);
	}

	public List findByVal9(Object val9) {
		return findByProperty(VAL9, val9);
	}

	public List findByVal10(Object val10) {
		return findByProperty(VAL10, val10);
	}

	public List findByVal11(Object val11) {
		return findByProperty(VAL11, val11);
	}

	public List findByVal12(Object val12) {
		return findByProperty(VAL12, val12);
	}

	public List findByVal13(Object val13) {
		return findByProperty(VAL13, val13);
	}

	public List findByVal14(Object val14) {
		return findByProperty(VAL14, val14);
	}

	public List findByVal15(Object val15) {
		return findByProperty(VAL15, val15);
	}

	public List findByVal16(Object val16) {
		return findByProperty(VAL16, val16);
	}

	public List findByVal17(Object val17) {
		return findByProperty(VAL17, val17);
	}

	public List findByVal18(Object val18) {
		return findByProperty(VAL18, val18);
	}

	public List findByVal19(Object val19) {
		return findByProperty(VAL19, val19);
	}

	public List findByVal20(Object val20) {
		return findByProperty(VAL20, val20);
	}

	public List findByVal21(Object val21) {
		return findByProperty(VAL21, val21);
	}

	public List findByVal22(Object val22) {
		return findByProperty(VAL22, val22);
	}

	public List findByVal23(Object val23) {
		return findByProperty(VAL23, val23);
	}

	public List findByVal24(Object val24) {
		return findByProperty(VAL24, val24);
	}

	public List findByVal25(Object val25) {
		return findByProperty(VAL25, val25);
	}

	public List findByVal26(Object val26) {
		return findByProperty(VAL26, val26);
	}

	public List findByVal27(Object val27) {
		return findByProperty(VAL27, val27);
	}

	public List findByMemo(Object memo) {
		return findByProperty(MEMO, memo);
	}

	public List findAll() {
		log.debug("finding all HrXcSalaryD instances");
		try {
			String queryString = "from HrXcSalaryD";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public HrXcSalaryD merge(HrXcSalaryD detachedInstance) {
		log.debug("merging HrXcSalaryD instance");
		try {
			HrXcSalaryD result = (HrXcSalaryD) getHibernateTemplate().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(HrXcSalaryD instance) {
		log.debug("attaching dirty HrXcSalaryD instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(HrXcSalaryD instance) {
		log.debug("attaching clean HrXcSalaryD instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static HrXcSalaryDDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (HrXcSalaryDDAO) ctx.getBean("HrXcSalaryDDAO");
	}
}